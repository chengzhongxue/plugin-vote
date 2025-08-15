package com.kunkunyu.vote.reconciler;


import com.kunkunyu.vote.Vote;
import com.kunkunyu.vote.VoteData;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import run.halo.app.extension.ExtensionClient;
import run.halo.app.extension.ExtensionUtil;
import run.halo.app.extension.controller.Controller;
import run.halo.app.extension.controller.ControllerBuilder;
import run.halo.app.extension.controller.Reconciler;

import java.util.Set;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import static com.kunkunyu.vote.Constant.FINALIZER_NAME;
import static run.halo.app.extension.ExtensionUtil.addFinalizers;
import static run.halo.app.extension.ExtensionUtil.removeFinalizers;

/**
 * Reconciler for {@link VoteData}.
 *
 */

@Slf4j
@Component
@RequiredArgsConstructor
public class VoteDataReconciler implements Reconciler<Reconciler.Request> {

    private final ExtensionClient client;


    @Override
    public Result reconcile(Request request) {
        client.fetch(VoteData.class, request.name())
            .ifPresent(voteData -> {
                if (ExtensionUtil.isDeleted(voteData)) {
                    removeFinalizers(voteData.getMetadata(), Set.of(FINALIZER_NAME));
                    client.update(voteData);
                    return;
                }
                if (addFinalizers(voteData.getMetadata(), Set.of(FINALIZER_NAME))) {
                    client.fetch(Vote.class,voteData.getVoteName())
                        .ifPresent(vote -> {
                            var voteStats = vote.getStats();
                            if (voteStats == null) {
                                voteStats = new Vote.VoteStats();
                                voteStats.setVoteCount(0);
                                voteStats.setVoteUser(0);
                                voteStats.setVoteDataList(new ArrayList<>());
                                vote.setStats(voteStats);
                            }
                            
                            // 更新投票总数和用户数
                            voteStats.setVoteCount(voteStats.getVoteCount() + voteData.getVoteData().size());
                            voteStats.setVoteUser(voteStats.getVoteUser() + 1);
                            
                            // 更新voteDataList - 统计每个选项的投票数
                            updateVoteDataList(vote, voteData);
                            
                            client.update(vote);
                        });
                    client.update(voteData);
                }
            });
        return Result.doNotRetry();
    }

    @Override
    public Controller setupWith(ControllerBuilder builder) {
        return builder
            .extension(new VoteData())
            .build();
    }

    private void updateVoteDataList(Vote vote, VoteData voteData) {
        var voteStats = vote.getStats();
        var voteDataList = voteStats.getVoteDataList();
        
        // 创建选项ID到投票数的映射
        Map<String, Integer> voteCountMap = voteDataList.stream()
            .collect(Collectors.toMap(
                Vote.VotingData::getId,
                Vote.VotingData::getVoteCount,
                (existing, replacement) -> existing
            ));
        
        // 统计当前投票数据中每个选项的投票数
        for (String optionId : voteData.getVoteData()) {
            voteCountMap.put(optionId, voteCountMap.getOrDefault(optionId, 0) + 1);
        }
        
        // 重新构建voteDataList
        var updatedVoteDataList = voteCountMap.entrySet().stream()
            .map(entry -> {
                var votingData = new Vote.VotingData();
                votingData.setId(entry.getKey());
                votingData.setVoteCount(entry.getValue());
                return votingData;
            })
            .collect(Collectors.toList());
        
        voteStats.setVoteDataList(updatedVoteDataList);
    }
}
