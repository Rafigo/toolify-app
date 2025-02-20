import { UserStoryForm } from "@/models/planning-poker.model";

export interface UserStoryPayloadCreate {
  planningPokerId: string;
}

export interface UserStoryPayloadUpdate {
  userStory: UserStoryForm;
}

export interface UserStoryPayloadRemove {
  userStoryId: string;
}

export interface UserStoryPayloadGetAllByPlanningPokerId {
  planningPokerId: string;
}

export interface UserStoryPayloadUpdateRanks {
  userStoryId: string;
  rank: string;
}
