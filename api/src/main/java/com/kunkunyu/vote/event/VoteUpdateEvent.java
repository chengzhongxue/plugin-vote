package com.kunkunyu.vote.event;


import run.halo.app.plugin.SharedEvent;

@SharedEvent
public class VoteUpdateEvent extends VoteEvent {

    public VoteUpdateEvent(Object source, String voteName) {
        super(source,voteName);
    }
}
