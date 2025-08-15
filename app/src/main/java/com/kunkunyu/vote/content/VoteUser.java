package com.kunkunyu.vote.content;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.List;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

@Data
@Accessors(chain = true)
public class VoteUser {

    @Schema(requiredMode = REQUIRED)
    private String id;

    @Schema(requiredMode = REQUIRED)
    private List<Contributor> userList;
}
