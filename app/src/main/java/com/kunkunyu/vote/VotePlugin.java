package com.kunkunyu.vote;

import org.springframework.stereotype.Component;
import run.halo.app.extension.Scheme;
import run.halo.app.extension.SchemeManager;
import run.halo.app.extension.index.IndexSpecs;
import run.halo.app.plugin.BasePlugin;
import run.halo.app.plugin.PluginContext;
import java.util.Optional;


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
            indexSpecs.add(
                IndexSpecs.<Vote, String>single("spec.title", String.class)
                    .indexFunc(
                        vote -> Optional.ofNullable(vote.getSpec())
                            .map(Vote.VoteSpec::getTitle)
                            .orElse(null)
                    )
            );
            indexSpecs.add(
                IndexSpecs.<Vote, String>single("spec.remark", String.class)
                    .indexFunc(
                        vote -> Optional.ofNullable(vote.getSpec())
                            .map(Vote.VoteSpec::getRemark)
                            .orElse(null)
                    )
            );
            indexSpecs.add(
                IndexSpecs.<Vote, String>single("spec.owner", String.class)
                    .indexFunc(
                        vote -> Optional.ofNullable(vote.getSpec())
                            .map(Vote.VoteSpec::getOwner)
                            .orElse(null)
                    )
            );
            indexSpecs.add(
                IndexSpecs.<Vote, Vote.VoteType>single("spec.type", Vote.VoteType.class)
                    .indexFunc(
                        vote -> Optional.ofNullable(vote.getSpec())
                            .map(Vote.VoteSpec::getType)
                            .orElse(null)
                    )
            );
            indexSpecs.add(
                IndexSpecs.<Vote, Boolean>single("spec.hasEnded", Boolean.class)
                    .indexFunc(
                        vote -> Optional.ofNullable(vote.getSpec())
                            .map(Vote.VoteSpec::getHasEnded)
                            .orElse(false)
                    )
            );
            indexSpecs.add(IndexSpecs.<Vote, String>single("spec.subjectRef", String.class)
                .indexFunc(snapshot -> Optional.ofNullable(snapshot.getSpec())
                    .map(Vote.VoteSpec::getSubjectRef)
                    .map(Vote::toSubjectRefKey)
                    .orElse(null)
                )
            );
        });
        schemeManager.register(VoteData.class, indexSpecs -> {
            indexSpecs.add(
                IndexSpecs.<VoteData, String>single("voteName", String.class)
                    .indexFunc(
                        voteData -> Optional.ofNullable(voteData.getVoteName())
                            .orElse(null)
                    )
            );
            indexSpecs.add(
                IndexSpecs.<VoteData, String>single("owner", String.class)
                    .indexFunc(
                        voteData -> Optional.ofNullable(voteData.getOwner())
                            .orElse(null)
                    )
            );
        });
    }

    @Override
    public void stop() {
        schemeManager.unregister(Scheme.buildFromType(Vote.class));
        schemeManager.unregister(Scheme.buildFromType(VoteData.class));
    }
}
