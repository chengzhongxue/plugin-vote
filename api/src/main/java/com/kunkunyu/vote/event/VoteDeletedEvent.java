package com.kunkunyu.vote.event;

import com.kunkunyu.vote.Vote;
import run.halo.app.plugin.SharedEvent;

@SharedEvent
public class VoteDeletedEvent extends VoteEvent {

    private final Vote vote;

    public VoteDeletedEvent(Object source, Vote vote) {
        super(source,vote.getMetadata().getName());
        this.vote = vote;
    }

    public Vote getVote() {
        return vote;
    }
}
