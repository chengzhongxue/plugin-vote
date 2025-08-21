package com.kunkunyu.vote.endpoint;

import com.kunkunyu.vote.VoteDetail;
import com.kunkunyu.vote.VoteUtils;
import com.kunkunyu.vote.content.VoteUser;
import com.kunkunyu.vote.Vote;
import com.kunkunyu.vote.VoteData;
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
import java.util.List;
import static com.kunkunyu.vote.Vote.VoteType.multiple;
import static com.kunkunyu.vote.Vote.VoteType.pk;
import static com.kunkunyu.vote.Vote.VoteType.single;
import static org.springdoc.core.fn.builders.apiresponse.Builder.responseBuilder;
import static org.springdoc.core.fn.builders.content.Builder.contentBuilder;
import static org.springdoc.core.fn.builders.parameter.Builder.parameterBuilder;
import static org.springdoc.core.fn.builders.requestbody.Builder.requestBodyBuilder;

@Slf4j
@Component
@RequiredArgsConstructor
public class AnonymousVoteEndpoint implements CustomEndpoint {

    private final VoteService voteService;

    @Override
    public RouterFunction<ServerResponse> endpoint() {
        final var tag = "api.vote.kunkunyu.com/v1alpha1/Vote";
        var namePathParam = parameterBuilder().name("name")
            .in(ParameterIn.PATH)
            .required(true)
            .implementation(String.class);
        return SpringdocRouteBuilder.route()
            .GET("votes", this::queryVotes, builder -> {
                    builder.operationId("QueryVotes")
                        .tag(tag)
                        .description("分页查询投票列表")
                        .response(
                            responseBuilder()
                                .implementation(ListResult.generateGenericClass(Vote.class))
                        );
                    VoteQuery.buildParameters(builder);
                }
            )
            .GET("votes/{name}/detail", this::getVoteDetail, builder -> {
                    builder.operationId("GetVoteDetail")
                        .tag(tag)
                        .description("投票详情")
                        .parameter(namePathParam)
                        .response(
                            responseBuilder()
                                .implementation(VoteDetail.class)
                        );
                }
            )
            .POST("votes/{name}/submit", this::submitVoteData,
                builder -> builder.operationId("SubmitVoteData")
                    .tag(tag)
                    .description("用户提交投票")
                    .parameter(namePathParam)
                    .requestBody(requestBodyBuilder()
                        .required(true)
                        .content(contentBuilder()
                            .mediaType(MediaType.APPLICATION_JSON_VALUE)
                            .schema(Builder.schemaBuilder()
                                .implementation(VoteData.class))
                        ))
                    .response(responseBuilder()
                        .implementation(VoteData.class))
            )
            .GET("votes/{name}/user-list", this::getVoteUserList, builder -> {
                    builder.operationId("GetVoteUserList")
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

    Mono<ServerResponse> queryVotes(ServerRequest serverRequest) {
        VoteQuery voteQuery = new VoteQuery(serverRequest);
        return voteService.listVote(voteQuery)
            .flatMap(votes -> ServerResponse.ok().bodyValue(votes));
    }

    Mono<ServerResponse> getVoteDetail(ServerRequest request) {
        var name = request.pathVariable("name");
        return  getCurrentUser()
            .flatMap(username -> {
                String owner = username;
                if (owner.equals("anonymousUser")) {
                    owner = VoteUtils.getSessionKey(request);
                }
                return voteService.getVoteDetail(name,owner);
            })
            .flatMap(voteDetail -> ServerResponse.ok().bodyValue(voteDetail));
    }

    private Mono<ServerResponse> submitVoteData(ServerRequest request) {
        var name = request.pathVariable("name");
        var voteDataBody = request.bodyToMono(VoteData.class);
        return getCurrentUser()
            .flatMap(username -> voteService.getByName(name)
                .flatMap(vote -> voteDataBody.doOnNext(voteData -> {
                    String owner = username;
                    var spec = vote.getSpec();
                    Vote.VoteType type = spec.getType();
                    List<Vote.VoteOption> options = spec.getOptions();
                    Boolean hasEnded = spec.getHasEnded();
                    Boolean canAnonymously = spec.getCanAnonymously();
                    List<String> voteDataList = voteData.getVoteData();
                    Integer maxVotes = spec.getMaxVotes();
                    if (hasEnded) {
                        throw new ServerWebInputException("Voting is over. Submission is prohibited");
                    }
                    if (!canAnonymously && owner.equals("anonymousUser")) {
                        throw new ServerWebInputException("Anonymous voting is prohibited");
                    }
                    if (voteDataList.isEmpty()) {
                        throw new ServerWebInputException("Please select the voting options");
                    }else {
                        int size = voteDataList.size();
                        if (type.equals(single) || type.equals(pk)) {
                            if (size!=1) {
                                throw new ServerWebInputException("At present, only one option can be chosen in the voting");
                            }
                        }
                        if (type.equals(multiple)) {
                            if (size>maxVotes) {
                                throw new ServerWebInputException("The number of voting options exceeds the limit");
                            }
                        }

                        // 判断voteDataList中的数据是否存在于options中
                        for (String id : voteDataList) {
                            boolean notExists = false;
                            for (Vote.VoteOption option : options) {
                                if (option.getId().equals(id)) {
                                    notExists = true;
                                    break;
                                }
                            }
                            if (!notExists) {
                                throw new ServerWebInputException("The voting data is incorrect and there are unknown options");
                            }
                        }

                    }

                    if (owner.equals("anonymousUser")) {
                        owner = VoteUtils.getSessionKey(request);
                    }
                    voteData.setVoteName(name);
                    voteData.setOwner(owner);
                }))
                .flatMap(voteData -> voteService.submitVoteData(voteData))
                .flatMap(voteData -> ServerResponse.ok().bodyValue(voteData))
            );
    }

    Mono<ServerResponse> getVoteUserList(ServerRequest request) {
        var name = request.pathVariable("name");
        return voteService.getByName(name)
            .flatMap(vote -> {
                Boolean canSeeVoters = vote.getSpec().getCanSeeVoters();
                if (!canSeeVoters) {
                    return Mono.error(new ServerWebInputException("The selected user cannot be viewed"));
                }
                return voteService.getVoteUserList(name).collectList();
            })
            .flatMap(voteUserList -> ServerResponse.ok().bodyValue(voteUserList));
    }

    protected Mono<String> getCurrentUser() {
        return ReactiveSecurityContextHolder.getContext()
            .map(SecurityContext::getAuthentication)
            .map(Principal::getName);
    }

    @Override
    public GroupVersion groupVersion() {
        return GroupVersion.parseAPIVersion("api.vote.kunkunyu.com/v1alpha1");
    }
}
