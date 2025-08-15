import { axiosInstance } from "@halo-dev/api-client";
import {
  VoteV1alpha1Api,
  ConsoleApiVoteKunkunyuComV1alpha1VoteApi,
  ApiVoteKunkunyuComV1alpha1VoteApi,
  UcApiVoteKunkunyuComV1alpha1VoteApi

} from "./generated";

const voteCoreApiClient = {
  vote: new VoteV1alpha1Api(undefined, "", axiosInstance),
}

const voteApiClient = {
  vote: new ConsoleApiVoteKunkunyuComV1alpha1VoteApi(undefined, "", axiosInstance),
  common: new ApiVoteKunkunyuComV1alpha1VoteApi(undefined, "", axiosInstance),
}

const voteUcApiClient = {
  vote: new UcApiVoteKunkunyuComV1alpha1VoteApi(undefined, "", axiosInstance),
}

export { voteCoreApiClient, voteApiClient, voteUcApiClient};
