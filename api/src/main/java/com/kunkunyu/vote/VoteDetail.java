package com.kunkunyu.vote;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.List;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

@Data
@Accessors(chain = true)
public class VoteDetail {

    @Schema(requiredMode = REQUIRED)
    private Vote vote;

    private List<Vote.VotingData> voteDataList;

    private List<String> userVoteData;

    @Schema(requiredMode = REQUIRED)
    private Integer voteCount;

    @Schema(requiredMode = REQUIRED)
    private Integer voteUser;


}
