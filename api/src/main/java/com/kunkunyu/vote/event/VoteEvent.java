package com.kunkunyu.vote.event;

import org.springframework.context.ApplicationEvent;


public abstract class VoteEvent extends ApplicationEvent {

    private final String name;

    public VoteEvent(Object source, String name) {
        super(source);
        this.name = name;
    }


    public String getName() {
        return name;
    }
}
