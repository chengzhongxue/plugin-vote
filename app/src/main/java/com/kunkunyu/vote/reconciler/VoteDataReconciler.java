package com.kunkunyu.vote.reconciler;


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
                addFinalizers(voteData.getMetadata(), Set.of(FINALIZER_NAME));
                client.update(voteData);
            });
        return Result.doNotRetry();
    }

    @Override
    public Controller setupWith(ControllerBuilder builder) {
        return builder
            .extension(new VoteData())
            .build();
    }
}
