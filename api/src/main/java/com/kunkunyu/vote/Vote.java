package com.kunkunyu.vote;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import run.halo.app.extension.AbstractExtension;
import run.halo.app.extension.GVK;
import run.halo.app.extension.Ref;

import java.time.Instant;
import java.util.List;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

@Data
@ToString(callSuper = true)
@GVK(kind = Vote.KIND, group = Constant.GROUP,
    version = Constant.VERSION, singular = "vote", plural = "votes")
@EqualsAndHashCode(callSuper = true)
public class Vote extends AbstractExtension {
    
    public static final String KIND = "Vote";

    public static final String Cookie = "VOTE_SESSION_KEY";
    public static final String NEW_ANNO = "new";

    @Schema(requiredMode = REQUIRED)
    private VoteSpec spec;

    @Schema
    private VoteStats stats;

    @Data
    public static class VoteSpec {

        @Schema(requiredMode = REQUIRED)
        private String title;

        private String remark;

        @Schema(requiredMode = REQUIRED)
        private VoteType type;

        private Integer maxVotes;

        @Schema(requiredMode = REQUIRED,description = "选项")
        private List<VoteOption> options;

        @Schema(requiredMode = REQUIRED)
        private VoteTimeLimit timeLimit;

        private Instant startDate;

        private Instant endDate;

        private String owner;

        @Schema(requiredMode = REQUIRED,defaultValue = "false",description = "投票结束")
        private Boolean hasEnded;

        @Schema(requiredMode = REQUIRED,defaultValue = "false",description = "可以匿名投票")
        private Boolean canAnonymously;

        @Schema(requiredMode = REQUIRED,description = "可以看到选择用户")
        private Boolean canSeeVoters;

        private Ref subjectRef;
    }


    @Data
    public static class VoteStats {

        private Integer voteCount;

        private Integer voteUser;

        private List<VotingData> voteDataList;

    }

    @Data
    public static class VoteOption {

        @Schema(description = "选项唯一值")
        private String id;

        @Schema(requiredMode = REQUIRED,description = "选项标题")
        private String title;

    }

    @Data
    public static class VotingData {

        @Schema(requiredMode = REQUIRED)
        private String id;

        @Schema(requiredMode = REQUIRED)
        private Integer voteCount;

    }

    public static enum VoteType {
        single,   //单选
        multiple, //多选
        pk;       //双选PK
    }

    public static enum VoteTimeLimit {
        custom,     //自定义
        permanent,  //永久
        thirty,     //30
        seven,      //7
        one;        //1
    }


    public static String toSubjectRefKey(Ref subjectRef) {
        return subjectRef.getGroup() + "/" + subjectRef.getKind() + "/" + subjectRef.getName();
    }


}