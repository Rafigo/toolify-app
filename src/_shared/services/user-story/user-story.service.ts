import axios from "axios";

import { UserSroryForm, UserStoryFromApi } from "@/models/planning-poker.model";

export interface UpdatePlanningPokerPayload {
  id: string;
  title: string;
  description: string;
}

export interface CreateUserStoryPayload {
  planningPokerId: string;
}

export interface UpdateUserStoryPayload {
  userStory: UserSroryForm;
}

export interface RemoveUserStoryPayload {
  userStoryId: string;
}

const create = async ({ planningPokerId }: CreateUserStoryPayload) => {
  const { data } = await axios.post("http://localhost:3001/user-story/create", {
    planningPokerId,
    title: "test",
  });
  return data as UserStoryFromApi;
};

const update = async ({ userStory }: UpdateUserStoryPayload) => {
  const { data } = await axios.put("http://localhost:3001/user-story/update", {
    ...userStory,
  });
  return data as UserStoryFromApi;
};

const remove = async ({ userStoryId }: RemoveUserStoryPayload) => {
  const { data } = await axios.delete(
    `http://localhost:3001/user-story/delete/${userStoryId}`
  );
  return data as UserStoryFromApi;
};

const userStoryService = { create, update, remove };

export default userStoryService;
