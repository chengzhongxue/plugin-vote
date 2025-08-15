package com.kunkunyu.vote;


import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import run.halo.app.extension.AbstractExtension;
import run.halo.app.extension.GVK;
import java.util.List;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

@Data
@ToString(callSuper = true)
@GVK(kind = VoteData.KIND, group = Constant.GROUP,
    version = Constant.VERSION, singular = "votedata", plural = "votedatas")
@EqualsAndHashCode(callSuper = true)
public class VoteData extends AbstractExtension {

    public static final String KIND = "VoteData";

    @Schema(requiredMode = REQUIRED)
    private String voteName;

    @Schema(requiredMode = REQUIRED)
    private String owner;

    @Schema(requiredMode = REQUIRED)
    private List<String> voteData;
    
}