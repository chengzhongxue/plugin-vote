package com.kunkunyu.vote;

import org.springframework.stereotype.Component;
import run.halo.app.extension.Ref;
import run.halo.app.extension.Scheme;
import run.halo.app.extension.SchemeManager;
import run.halo.app.extension.index.IndexSpec;
import run.halo.app.plugin.BasePlugin;
import run.halo.app.plugin.PluginContext;

import static run.halo.app.extension.index.IndexAttributeFactory.simpleAttribute;

@Component
public class VotePlugin extends BasePlugin {

    private final SchemeManager schemeManager;

    public VotePlugin(PluginContext pluginContext, SchemeManager schemeManager) {
        super(pluginContext);
        this.schemeManager = schemeManager;
    }

    @Override
    public void start() {
        schemeManager.register(Vote.class, indexSpecs -> {
            indexSpecs.add(new IndexSpec()
                .setName("spec.title")
                .setIndexFunc(simpleAttribute(
                    Vote.class, vote -> vote.getSpec().getTitle())));
            indexSpecs.add(new IndexSpec()
                .setName("spec.remark")
                .setIndexFunc(simpleAttribute(
                    Vote.class, vote -> vote.getSpec().getRemark()))
            );
            indexSpecs.add(new IndexSpec()
                .setName("spec.owner")
                .setIndexFunc(simpleAttribute(
                    Vote.class, vote -> vote.getSpec().getOwner()))
            );
            indexSpecs.add(new IndexSpec()
                .setName("spec.type")
                .setIndexFunc(simpleAttribute(Vote.class, vote -> {
                    var type = vote.getSpec().getType();
                    return type == null ? null : type.name();
                })));
            indexSpecs.add(new IndexSpec()
                .setName("spec.hasEnded")
                .setIndexFunc(simpleAttribute(Vote.class, vote -> {
                    var hasEnded = vote.getSpec().getHasEnded();
                    return hasEnded == null ? "false" : hasEnded.toString();
                })));
            indexSpecs.add(new IndexSpec()
                .setName("spec.subjectRef")
                .setIndexFunc(simpleAttribute(Vote.class,
                    vote -> {
                        Ref subjectRef = vote.getSpec().getSubjectRef();
                        return subjectRef == null ? null : Vote.toSubjectRefKey(subjectRef);
                    })
                ));
        });
        schemeManager.register(VoteData.class, indexSpecs -> {
            indexSpecs.add(new IndexSpec()
                .setName("voteName")
                .setIndexFunc(simpleAttribute(
                    VoteData.class, voteData -> voteData.getVoteName())));
            indexSpecs.add(new IndexSpec()
                .setName("owner")
                .setIndexFunc(simpleAttribute(
                    VoteData.class, voteData -> voteData.getOwner()))
            );
        });
    }

    @Override
    public void stop() {
        schemeManager.unregister(Scheme.buildFromType(Vote.class));
        schemeManager.unregister(Scheme.buildFromType(VoteData.class));
    }
}
