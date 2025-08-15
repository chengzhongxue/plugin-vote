package com.kunkunyu.vote.event;


import run.halo.app.plugin.SharedEvent;

@SharedEvent
public class VoteCreateEvent extends VoteEvent {

    public VoteCreateEvent(Object source, String voteName) {
        super(source,voteName);
    }
}
