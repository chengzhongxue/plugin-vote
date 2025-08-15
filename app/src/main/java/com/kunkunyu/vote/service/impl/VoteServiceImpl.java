package com.kunkunyu.vote.service.impl;

import com.kunkunyu.vote.content.Contributor;
import com.kunkunyu.vote.VoteDetail;
import com.kunkunyu.vote.content.VoteUser;
import com.kunkunyu.vote.Vote;
import com.kunkunyu.vote.VoteData;
import com.kunkunyu.vote.query.VoteQuery;
import com.kunkunyu.vote.service.VoteService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;
import run.halo.app.core.user.service.UserService;
import run.halo.app.extension.ListOptions;
import run.halo.app.extension.ListResult;
import run.halo.app.extension.Metadata;
import run.halo.app.extension.PageRequestImpl;
import run.halo.app.extension.ReactiveExtensionClient;
import run.halo.app.extension.router.selector.FieldSelector;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import static com.kunkunyu.vote.Vote.VoteType.multiple;
import static org.springframework.data.domain.Sort.Order.asc;
import static org.springframework.data.domain.Sort.Order.desc;
import static run.halo.app.extension.index.query.QueryFactory.and;
import static run.halo.app.extension.index.query.QueryFactory.equal;
import static run.halo.app.extension.index.query.QueryFactory.isNull;

@Service
@RequiredArgsConstructor
public class VoteServiceImpl implements VoteService {

    private final ReactiveExtensionClient client;

    private final UserService userService;

    @Override
    public Mono<ListResult<Vote>> listVote(VoteQuery query) {
        return client.listBy(Vote.class, query.toListOptions(),
            PageRequestImpl.of(query.getPage(), query.getSize(), query.getSort()));
    }

    @Override
    public Mono<Vote> getByName(String name) {
        return client.get(Vote.class, name);
    }

    @Override
    public Mono<Vote> getByUsername(String voteName, String username) {
        return client.get(Vote.class, voteName)
            .filter(vote -> Objects.equals(username, vote.getSpec().getOwner()));
    }

    @Override
    public Mono<Vote> createVote(Vote vote) {
        return client.create(vote);
    }

    @Override
    public Mono<Vote> updateVote(Vote vote) {
        return client.update(vote);
    }

    @Override
    public Mono<VoteDetail> getVoteDetail(String name, String username) {
        return client.fetch(Vote.class, name)
            .flatMap(vote -> getVoteDetail(vote,username));
    }

    @Override
    public Mono<VoteData> submitVoteData(VoteData voteData) {
        return getUserVoteData(voteData.getVoteName(),voteData.getOwner())
            .switchIfEmpty(Mono.defer(() -> {
                    Metadata metadata = new Metadata();
                    metadata.setGenerateName(voteData.getVoteName()+"-data-");
                    voteData.setMetadata(metadata);
                    return client.create(voteData);
            })).retryWhen(Retry.backoff(5, Duration.ofMillis(100))
                .filter(OptimisticLockingFailureException.class::isInstance));
    }

    @Override
    public Flux<VoteUser> getVoteUserList(String name) {
        return getVoteDataList(name).collectList()
            .flatMapMany(voteDataList -> {
                if (!voteDataList.isEmpty()) {
                    Map<String, List<String>> voteIdToUsersMap = new HashMap<>();

                    // 处理每个VoteData对象，按投票ID收集用户
                    for (VoteData voteData : voteDataList) {
                        String owner = voteData.getOwner();
                        List<String> voteIds = voteData.getVoteData();

                        if (voteIds != null && !voteIds.isEmpty()) {
                            for (String voteId : voteIds) {
                                voteIdToUsersMap.computeIfAbsent(voteId, k -> new ArrayList<>())
                                    .add(owner);
                            }
                        }
                    }

                    return Flux.fromIterable(voteIdToUsersMap.entrySet())
                        .flatMap(entry -> {
                            String voteId = entry.getKey();
                            List<String> owners = entry.getValue();

                            Mono<List<Contributor>> contributorsMono = Flux.fromIterable(owners)
                                .flatMap(this::getUser)
                                .collectList();

                            return contributorsMono.map(contributors -> {
                                VoteUser voteUser = new VoteUser();
                                voteUser.setId(voteId);
                                voteUser.setUserList(contributors);
                                return voteUser;
                            });
                        });
                }
                return Flux.empty();
            });
    }


    public void initVote(Vote vote) {
        var spec = vote.getSpec();
        var type = spec.getType();
        Integer maxVotes = spec.getMaxVotes();
        var options = spec.getOptions();
        int index = 0;
        for (Vote.VoteOption option : options) {
            index = index+1;
            option.setId(String.valueOf(index));
        }
        if (type.equals(multiple)) {
            if (ObjectUtils.equals(maxVotes,0) || ObjectUtils.isEmpty(maxVotes)) {
                spec.setMaxVotes(2);
            }
        }
        var timeLimit = spec.getTimeLimit();
        Instant startDate = spec.getStartDate();
        if (ObjectUtils.isEmpty(startDate)) {
            startDate = Instant.now();
            spec.setStartDate(startDate);
        }
        Duration day = Duration.ofDays(7);
        switch (timeLimit) {
            case custom:
                Instant endDate = spec.getEndDate();
                if (ObjectUtils.isEmpty(endDate)) {
                    day = Duration.ofDays(7);
                    spec.setEndDate(startDate.plus(day));
                }
                break;
            case thirty:
                day = Duration.ofDays(30);
                spec.setEndDate(startDate.plus(day));
                break;
            case seven:
                day = Duration.ofDays(7);
                spec.setEndDate(startDate.plus(day));
                break;
            case one:
                day = Duration.ofDays(1);
                spec.setEndDate(startDate.plus(day));
                break;
        }

        var stats = vote.getStats();
        if (stats == null) {
            var newStats = new Vote.VoteStats();
            newStats.setVoteCount(0);
            newStats.setVoteUser(0);
            vote.setStats(newStats);
        }
    }

    @Override
    public Mono<Vote> deleteVote(Vote vote) {
        return client.delete(vote);
    }

    public Mono<Contributor> getUser(String owner) {
        return userService.getUserOrGhost(owner)
            .map(user -> {
                Contributor contributor = new Contributor();
                String name = user.getMetadata().getName();
                if (name.equals("ghost")) {
                    contributor.setName("anonymousUser");
                    contributor.setDisplayName("匿名");
                }else {
                    contributor.setName(user.getMetadata().getName());
                    contributor.setDisplayName(user.getSpec().getDisplayName());
                    contributor.setAvatar(user.getSpec().getAvatar());
                }

                return contributor;
            });
    }

    public Mono<VoteDetail> getVoteDetail(Vote vote,String username) {
        Assert.notNull(vote, "The vote must not be null.");

        String voteName = vote.getMetadata().getName();
        var spec = vote.getSpec();
        var stats = vote.getStats();

        var voteDetail = new VoteDetail().setVote(vote);

        voteDetail.setVoteDataList(stats.getVoteDataList());

        var userVoteDataMono = getUserVoteData(voteName,username)
            .map(userVote -> {
                List<String> userVoteData = new ArrayList<>();
                if (userVote != null) {
                    userVoteData = userVote.getVoteData();
                }
                return userVoteData;
            })
            .doOnNext(voteDetail::setUserVoteData);


        voteDetail.setVoteCount(stats.getVoteCount());
        voteDetail.setVoteUser(stats.getVoteUser());

        return Mono.when(userVoteDataMono)
            .thenReturn(voteDetail);
    }

    public Flux<VoteData> getVoteDataList(String voteName) {
        var listOptions = new ListOptions();
        final var sort = Sort.by(asc("metadata.creationTimestamp"));
        listOptions.setFieldSelector(FieldSelector.of(
            and(equal("voteName", voteName),
                isNull("metadata.deletionTimestamp"))
        ));
        return client.listAll(VoteData.class,listOptions, sort);
    }

    public Mono<VoteData> getUserVoteData(String voteName,String username) {
        var listOptions = new ListOptions();
        final var sort = Sort.by(desc("metadata.creationTimestamp"));
        listOptions.setFieldSelector(FieldSelector.of(
            and(equal("voteName", voteName),
                equal("owner", username),

                isNull("metadata.deletionTimestamp"))
        ));
        return client.listAll(VoteData.class,listOptions, sort).take(1L).next();
    }

}
