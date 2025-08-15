package com.kunkunyu.vote.endpoint;

import com.kunkunyu.vote.content.VoteUser;
import com.kunkunyu.vote.Vote;
import com.kunkunyu.vote.query.VoteQuery;
import com.kunkunyu.vote.service.VoteService;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springdoc.core.fn.builders.schema.Builder;
import org.springdoc.webflux.core.fn.SpringdocRouteBuilder;
import org.springframework.http.MediaType;
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

import java.security.Principal;
import java.util.HashMap;

import static com.kunkunyu.vote.Vote.NEW_ANNO;
import static org.springdoc.core.fn.builders.apiresponse.Builder.responseBuilder;
import static org.springdoc.core.fn.builders.content.Builder.contentBuilder;
import static org.springdoc.core.fn.builders.parameter.Builder.parameterBuilder;
import static org.springdoc.core.fn.builders.requestbody.Builder.requestBodyBuilder;

@Slf4j
@Component
@RequiredArgsConstructor
public class VoteEndpoint implements CustomEndpoint {

    private final VoteService voteService;

    @Override
    public RouterFunction<ServerResponse> endpoint() {
        final var tag = "console.api.vote.kunkunyu.com/v1alpha1/Vote";
        var namePathParam = parameterBuilder().name("name")
            .in(ParameterIn.PATH)
            .required(true)
            .implementation(String.class);
        return SpringdocRouteBuilder.route()
            .GET("votes", this::listVote, builder -> {
                    builder.operationId("ListVotes")
                        .tag(tag)
                        .description("分页查询投票列表")
                        .response(
                            responseBuilder()
                                .implementation(ListResult.generateGenericClass(Vote.class))
                        );
                    VoteQuery.buildParameters(builder);
                }
            )
            .POST("votes", this::createVote,
                builder -> builder.operationId("CreateVote")
                    .tag(tag)
                    .description("添加投票")
                    .requestBody(requestBodyBuilder()
                        .required(true)
                        .content(contentBuilder()
                            .mediaType(MediaType.APPLICATION_JSON_VALUE)
                            .schema(Builder.schemaBuilder()
                                .implementation(Vote.class))
                        ))
                    .response(responseBuilder()
                        .implementation(Vote.class))
            )
            .PUT("votes/{name}", this::updateVote,
                builder -> builder.operationId("UpdateVote")
                    .tag(tag)
                    .description("编辑投票")
                    .parameter(namePathParam)
                    .requestBody(requestBodyBuilder()
                        .required(true)
                        .content(contentBuilder()
                            .mediaType(MediaType.APPLICATION_JSON_VALUE)
                            .schema(Builder.schemaBuilder()
                                .implementation(Vote.class))
                        ))
                    .response(responseBuilder()
                        .implementation(Vote.class))
            )
            .GET("votes/{name}/user-list", this::getVoteUserList, builder -> {
                    builder.operationId("VoteUserList")
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

    Mono<ServerResponse> listVote(ServerRequest serverRequest) {
        VoteQuery voteQuery = new VoteQuery(serverRequest);
        return voteService.listVote(voteQuery)
            .flatMap(votes -> ServerResponse.ok().bodyValue(votes));
    }

    private Mono<ServerResponse> createVote(ServerRequest request) {
        return getCurrentUser()
            .flatMap(username -> request.bodyToMono(Vote.class)
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
                .flatMap(voteService::createVote)
                .flatMap(vote -> ServerResponse.ok().bodyValue(vote))
            );
    }

    private Mono<ServerResponse> updateVote(ServerRequest request) {
        var name = request.pathVariable("name");
        var voteBody = request.bodyToMono(Vote.class);

        var updateVote = voteService.getByName(name).flatMap(oldVote ->
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
            }).flatMap(voteService::updateVote)
        );

        return ServerResponse.ok().body(updateVote,Vote.class);
    }

    Mono<ServerResponse> getVoteUserList(ServerRequest request) {
        var name = request.pathVariable("name");
        return voteService.getByName(name)
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
        return GroupVersion.parseAPIVersion("console.api.vote.kunkunyu.com/v1alpha1");
    }
}
