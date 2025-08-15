package com.kunkunyu.vote.endpoint.uc;

import static com.kunkunyu.vote.Vote.NEW_ANNO;
import static org.springdoc.core.fn.builders.apiresponse.Builder.responseBuilder;
import static org.springdoc.core.fn.builders.parameter.Builder.parameterBuilder;
import static org.springdoc.core.fn.builders.requestbody.Builder.requestBodyBuilder;

import com.kunkunyu.vote.content.VoteUser;
import com.kunkunyu.vote.Vote;
import com.kunkunyu.vote.query.VoteQuery;
import com.kunkunyu.vote.service.VoteService;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import java.security.Principal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springdoc.webflux.core.fn.SpringdocRouteBuilder;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import org.springframework.web.server.ServerWebInputException;
import reactor.core.publisher.Mono;
import run.halo.app.core.extension.endpoint.CustomEndpoint;
import run.halo.app.extension.GroupVersion;
import run.halo.app.extension.ListResult;
import run.halo.app.extension.Metadata;
import run.halo.app.extension.MetadataOperator;

/**
 * post vote endpoint.
 */
@Slf4j
@Component
public class UcVoteEndpoint implements CustomEndpoint {

    private final VoteService voteService;


    public UcVoteEndpoint(VoteService voteService) {
        this.voteService = voteService;
    }

    @Override
    public RouterFunction<ServerResponse> endpoint() {
        final var tag = "uc.api.vote.kunkunyu.com/v1alpha1/Vote";
        var namePathParam = parameterBuilder().name("name")
            .description("Vote name")
            .in(ParameterIn.PATH)
            .required(true);
        return SpringdocRouteBuilder.route()
            .GET("votes", this::listMyVote, builder -> {
                    builder.operationId("ListMyVotes")
                        .tag(tag)
                        .description("分页查询投票列表")
                        .response(
                            responseBuilder()
                                .implementation(ListResult.generateGenericClass(Vote.class))
                        );
                    VoteQuery.buildParameters(builder);
                }
            )
            .GET("votes/{name}", this::getMyVote, builder ->
                builder.operationId("GetMyVote")
                .tag(tag)
                .parameter(namePathParam)
                .description("获取当前用户的投票")
                .response(responseBuilder().implementation(Vote.class))
            )
            .POST("votes", this::createMyVote, builder ->
                builder.operationId("CreateMyVote")
                .tag(tag)
                .description("创建当前用户的投票")
                .requestBody(requestBodyBuilder().implementation(Vote.class))
                .response(responseBuilder().implementation(Vote.class))
            )
            .PUT("votes/{name}", this::updateMyVote, builder ->
                builder.operationId("UpdateMyVote")
                    .tag(tag)
                    .parameter(namePathParam)
                    .description("更新当前用户的投票.")
                    .requestBody(requestBodyBuilder().implementation(Vote.class))
                    .response(responseBuilder().implementation(Vote.class))
            )
            .DELETE("votes/{name}", this::deleteMyVote, builder ->
                builder.operationId("DeleteMyVote")
                    .tag(tag)
                    .description("删除当前用户的投票")
                    .parameter(namePathParam)
                    .response(responseBuilder().implementation(Vote.class))
            )
            .GET("votes/{name}/user-list", this::getMyVoteUserList, builder -> {
                    builder.operationId("GetMyVoteUserList")
                        .tag(tag)
                        .description("投票用户列表")
                        .parameter(namePathParam)
                        .response(
                            responseBuilder()
                                .implementationArray(VoteUser.class)
                        );
                }
            )
            .build();
    }

    private Mono<ServerResponse> listMyVote(ServerRequest request) {
        var forumPosts = getCurrentUser()
            .map(username -> new VoteQuery(request, username))
            .flatMap(voteService::listVote);
        return ServerResponse.ok().body(forumPosts, Vote.class);
    }

    private Mono<ServerResponse> getMyVote(ServerRequest request) {
        var voteName = request.pathVariable("name");
        var vote = getMyVote(voteName);
        return ServerResponse.ok().body(vote, Vote.class);
    }

    private Mono<ServerResponse> createMyVote(ServerRequest request) {
        var voteFromRequest = request.bodyToMono(Vote.class)
            .switchIfEmpty(Mono.error(() -> new ServerWebInputException("Request body required.")));

        var createdVote =  getCurrentUser()
            .flatMap(username ->  voteFromRequest
                .doOnNext(vote -> {
                    var metadata = vote.getMetadata();
                    if (metadata != null) {
                        var annotations = metadata.getAnnotations();
                        if (annotations == null) {
                            annotations = new HashMap<>();
                        }
                        annotations.put(NEW_ANNO,"true");
                        metadata.setAnnotations(annotations);
                    }
                    vote.getSpec().setOwner(username);
                    voteService.initVote(vote);
                })
            )
            .flatMap(voteService::createVote);
        return ServerResponse.ok().body(createdVote, Vote.class);
    }

    private Mono<ServerResponse> updateMyVote(ServerRequest request) {
        var name = request.pathVariable("name");
        var voteBody = request.bodyToMono(Vote.class)
            .switchIfEmpty(Mono.error(() -> new ServerWebInputException("Request body required.")));

        var updateVote = getMyVote(name)
            .flatMap(oldVote ->
                voteBody.doOnNext(vote ->{
                    var oldSpec = oldVote.getSpec();
                    var oldStats = oldVote.getStats();

                    var spec = vote.getSpec();
                    var stats = vote.getStats();

                    Boolean hasEnded = vote.getSpec().getHasEnded();
                    if (hasEnded) {
                        throw new ServerWebInputException("Voting ends and editing is prohibited");
                    }
                    vote.setStats(oldStats);

                    if (stats.getVoteCount() > 0) {
                        spec.setType(oldSpec.getType());
                        spec.setOptions(oldSpec.getOptions());
                        spec.setMaxVotes(oldSpec.getMaxVotes());
                    }
                    voteService.initVote(vote);
                })
            ).flatMap(voteService::updateVote);

        return ServerResponse.ok().body(updateVote,Vote.class);
    }

    private Mono<ServerResponse> deleteMyVote(ServerRequest request) {
        var name = request.pathVariable("name");
        var orderMono = getMyVote(name);
        var deleteVote = orderMono.flatMap(voteService::deleteVote);
        return ServerResponse.ok().body(deleteVote, Vote.class);
    }

    private Mono<Vote> getMyVote(String voteName) {
        return getCurrentUser()
            .flatMap(username -> voteService.getByUsername(voteName, username)
                .switchIfEmpty(
                    Mono.error(() -> new ServerWebInputException("The vote was not found or deleted"))
                )
            );
    }

    Mono<ServerResponse> getMyVoteUserList(ServerRequest request) {
        var name = request.pathVariable("name");
        return getMyVote(name)
            .flatMap(vote -> voteService.getVoteUserList(name).collectList())
            .flatMap(voteUserList -> ServerResponse.ok().bodyValue(voteUserList));
    }

    protected Mono<String> getCurrentUser() {
        return ReactiveSecurityContextHolder.getContext()
            .map(SecurityContext::getAuthentication)
            .map(Principal::getName);
    }
    

    @Override
    public GroupVersion groupVersion() {
        return GroupVersion.parseAPIVersion("uc.api.vote.kunkunyu.com/v1alpha1");
    }

}
