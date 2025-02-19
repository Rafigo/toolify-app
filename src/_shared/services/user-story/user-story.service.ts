import axios from "axios";

import { UserStoryFromApi } from "@/models/planning-poker.model";

export interface UpdatePlanningPokerPayload {
  id: string;
  title: string;
  description: string;
}

export interface CreateUserStoryPayload {
  planningPokerId: string;
}

export const createUserStory = async ({
  planningPokerId,
}: CreateUserStoryPayload) => {
  const { data } = await axios.post("http://localhost:3001/user-story/create", {
    planningPokerId,
    title: "test",
  });
  return data as UserStoryFromApi;
};
