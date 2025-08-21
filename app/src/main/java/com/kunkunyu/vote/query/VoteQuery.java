package com.kunkunyu.vote.query;

import io.swagger.v3.oas.annotations.enums.ParameterIn;
import org.apache.commons.lang3.StringUtils;
import org.springdoc.core.fn.builders.operation.Builder;
import org.springframework.lang.Nullable;
import org.springframework.web.reactive.function.server.ServerRequest;
import run.halo.app.extension.ListOptions;
import run.halo.app.extension.router.IListRequest;
import run.halo.app.extension.router.SortableRequest;
import java.util.Optional;

import static org.springdoc.core.fn.builders.parameter.Builder.parameterBuilder;
import static run.halo.app.extension.index.query.QueryFactory.*;
import static run.halo.app.extension.router.QueryParamBuildUtil.sortParameter;

public class VoteQuery extends SortableRequest {

    private final String username;

    public VoteQuery(ServerRequest request) {
        this(request, null);
    }

    public VoteQuery(ServerRequest request, @Nullable String username) {
        super(request.exchange());
        this.username = username;
    }


    @Nullable
    public String getKeyword() {
        return queryParams.getFirst("keyword");
    }

    @Nullable
    public String getType() {
        return queryParams.getFirst("type");
    }

    @Nullable
    public String getHasEnded() {
        return queryParams.getFirst("hasEnded");
    }

    @Override
    public ListOptions toListOptions() {
        var builder = ListOptions.builder(super.toListOptions());

        Optional.ofNullable(getKeyword())
            .filter(StringUtils::isNotBlank)
            .ifPresent(keyword -> builder.andQuery(or(
                contains("spec.title", keyword),
                contains("spec.remark", keyword),
                contains("spec.owner", keyword),
                equal("metadata.name", keyword)
            )));

        Optional.ofNullable(getType())
            .filter(StringUtils::isNotBlank)
            .ifPresent(type -> builder.andQuery(equal("spec.type", type)));

        Optional.ofNullable(getHasEnded())
            .filter(StringUtils::isNotBlank)
            .ifPresent(hasEnded -> builder.andQuery(equal("spec.hasEnded", hasEnded)));

        Optional.ofNullable(username)
            .filter(StringUtils::isNotBlank)
            .ifPresent(username -> builder.andQuery(equal("spec.owner", username)));

        return builder.build();
    }

    public static void buildParameters(Builder builder) {
        IListRequest.buildParameters(builder);
        builder.parameter(sortParameter())
            .parameter(parameterBuilder()
                .in(ParameterIn.QUERY)
                .name("keyword")
                .description("Vote filtered by keyword.")
                .implementation(String.class)
                .required(false))
            .parameter(parameterBuilder()
                .in(ParameterIn.QUERY)
                .name("type")
                .description("Vote type.")
                .implementation(String.class)
                .required(false))
            .parameter(parameterBuilder()
                .in(ParameterIn.QUERY)
                .name("hasEnded")
                .description("Vote hasEnded.")
                .implementation(String.class)
                .required(false));

    }
}
