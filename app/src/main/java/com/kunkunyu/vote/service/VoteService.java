package com.kunkunyu.vote.service;

import com.kunkunyu.vote.VoteDetail;
import com.kunkunyu.vote.content.VoteUser;
import com.kunkunyu.vote.Vote;
import com.kunkunyu.vote.VoteData;
import com.kunkunyu.vote.query.VoteQuery;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import run.halo.app.extension.ListResult;

public interface VoteService {

    Mono<ListResult<Vote>> listVote(VoteQuery query);

    Mono<Vote> getByName(String name);

    Mono<Vote> getByUsername(String voteName, String username);

    Mono<Vote> createVote(Vote vote);

    Mono<Vote> updateVote(Vote vote);

    Mono<VoteDetail> getVoteDetail(String name,String username);

    Mono<VoteData>  submitVoteData(VoteData voteData);

    Flux<VoteUser> getVoteUserList(String name);

    void initVote(Vote vote);

    Mono<Vote> deleteVote(Vote vote);
}
