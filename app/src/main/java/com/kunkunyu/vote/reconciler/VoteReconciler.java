package com.kunkunyu.vote.reconciler;


import com.kunkunyu.vote.Vote;
import com.kunkunyu.vote.VoteData;
import com.kunkunyu.vote.event.VoteCreateEvent;
import com.kunkunyu.vote.event.VoteDeletedEvent;
import com.kunkunyu.vote.event.VoteUpdateEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;
import run.halo.app.extension.ExtensionClient;
import run.halo.app.extension.ExtensionUtil;
import run.halo.app.extension.ListOptions;
import run.halo.app.extension.MetadataUtil;
import run.halo.app.extension.controller.Controller;
import run.halo.app.extension.controller.ControllerBuilder;
import run.halo.app.extension.controller.Reconciler;
import run.halo.app.extension.controller.RequeueException;
import run.halo.app.extension.router.selector.FieldSelector;

import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static com.kunkunyu.vote.Constant.FINALIZER_NAME;
import static com.kunkunyu.vote.Vote.NEW_ANNO;
import static org.springframework.data.domain.Sort.Order.asc;
import static run.halo.app.extension.ExtensionUtil.addFinalizers;
import static run.halo.app.extension.ExtensionUtil.removeFinalizers;
import static run.halo.app.extension.index.query.Queries.*;

/**
 * Reconciler for {@link Vote}.
 *
 */

@Slf4j
@Component
@RequiredArgsConstructor
public class VoteReconciler implements Reconciler<Reconciler.Request> {

    private final ExtensionClient client;
    private final ApplicationEventPublisher eventPublisher;


    @Override
    public Result reconcile(Request request) {
        client.fetch(Vote.class, request.name())
            .ifPresent(vote -> {
                if (ExtensionUtil.isDeleted(vote)) {
                    removeFinalizers(vote.getMetadata(), Set.of(FINALIZER_NAME));
                    eventPublisher.publishEvent(new VoteDeletedEvent(this, vote));
                    cleanUpResources(vote);
                    client.update(vote);
                    return;
                }

                if (addFinalizers(vote.getMetadata(), Set.of(FINALIZER_NAME))) {
                    eventPublisher.publishEvent(new VoteCreateEvent(this, vote.getMetadata().getName()));
                    client.update(vote);
                }

                var annotations = MetadataUtil.nullSafeAnnotations(vote);
                var newData = annotations.getOrDefault(NEW_ANNO,"false");
                if (newData.equals("false")) {
                    // 处理voteDataList - 重新计算所有投票统计
                    recalculateVoteDataList(vote);
                }

                //处理过期
                var spec = vote.getSpec();
                final var now = Instant.now();
                if (!spec.getHasEnded() && !spec.getTimeLimit().equals(Vote.VoteTimeLimit.permanent)) {
                    if (spec.getEndDate().isBefore(now)) {
                        spec.setHasEnded(true);
                        client.update(vote);
                    }
                }

                eventPublisher.publishEvent(new VoteUpdateEvent(this, vote.getMetadata().getName()));

                scheduleIfNecessary(vote);

            });
        return Result.doNotRetry();
    }

    void scheduleIfNecessary(Vote vote) {
        var spec = vote.getSpec();
        if (spec.getHasEnded() || spec.getTimeLimit().equals(Vote.VoteTimeLimit.permanent)) {
            return;
        }
        final var now = Instant.now();
        Instant endInstant = vote.getSpec().getEndDate();
        if (endInstant.isAfter(now)) {
            throw new RequeueException(Result.requeue(Duration.between(now, endInstant)),
                "Requeue for scheduled expired.");
        }
    }

    private void recalculateVoteDataList(Vote vote) {
        String voteName = vote.getMetadata().getName();
        
        // 获取所有相关的投票数据
        var listOptions = new ListOptions();
        listOptions.setFieldSelector(FieldSelector.of(
            and(equal("voteName", voteName),
                isNull("metadata.deletionTimestamp"))
        ));
        
        var allVoteData = client.listAll(VoteData.class, listOptions, Sort.by(asc("metadata.creationTimestamp")));
        
        // 统计每个选项的投票数
        Map<String, Integer> voteCountMap = new HashMap<>();
        int totalVotes = 0;
        int totalUsers = 0;
        
        for (VoteData voteData : allVoteData) {
            totalUsers++;
            for (String optionId : voteData.getVoteData()) {
                voteCountMap.put(optionId, voteCountMap.getOrDefault(optionId, 0) + 1);
                totalVotes++;
            }
        }
        
        // 构建VotingData列表
        var voteDataList = voteCountMap.entrySet().stream()
            .map(entry -> {
                var votingData = new Vote.VotingData();
                votingData.setId(entry.getKey());
                votingData.setVoteCount(entry.getValue());
                return votingData;
            })
            .collect(Collectors.toList());
        
        // 更新VoteStats
        var voteStats = vote.getStats();
        if (voteStats == null) {
            voteStats = new Vote.VoteStats();
            vote.setStats(voteStats);
        }
        
        voteStats.setVoteCount(totalVotes);
        voteStats.setVoteUser(totalUsers);
        voteStats.setVoteDataList(voteDataList);
        
        // 更新投票对象
        client.update(vote);
    }

    private void cleanUpResources(Vote vote) {
        String voteName = vote.getMetadata().getName();
        var listOptions = new ListOptions();
        listOptions.setFieldSelector(FieldSelector.of(
            and(equal("voteName", voteName),
                isNull("metadata.deletionTimestamp"))
        ));
        client.listAll(VoteData.class,listOptions, Sort.by(asc("metadata.creationTimestamp")))
            .forEach(voteData -> client.delete(voteData));
    }


    @Override
    public Controller setupWith(ControllerBuilder builder) {
        return builder
            .extension(new Vote())
            .build();
    }
}
