// 定义接口数据结构（如果未定义）
interface VoteOption {
    id: string;
    title: string;
  }
  
  interface VoteSpec {
    title: string;
    type: string;
    maxVotes: number;
    options: VoteOption[];
    timeLimit: string;
    startDate: string;
    endDate?: string;
    owner: string;
    hasEnded: boolean;
    canAnonymously: boolean;
    canSeeVoters: boolean;
  }
  
  interface VoteStats {
    voteCount: number;
    voteUser: number;
  }
  
  interface VoteMetadata {
    generateName: string;
    name: string;
    version: number;
    creationTimestamp: string;
  }
  
  interface VoteData {
    id: string;
    voteCount: number;
  }
  
  interface VoteDetail {
    vote: {
      spec: VoteSpec;
      stats: VoteStats;
      apiVersion: string;
      kind: string;
      metadata: VoteMetadata;
    };
    voteDataList: VoteData[];
    userVoteData: string[];
    voteCount: number;
    voteUser: number;
  }