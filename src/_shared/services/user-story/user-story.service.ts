import axios from "axios";

import { UserStoryFromApi } from "@/models/planning-poker.model";
import {
  UserStoryPayloadCreate,
  UserStoryPayloadUpdate,
  UserStoryPayloadRemove,
  UserStoryPayloadGetAllByPlanningPokerId,
  UserStoryPayloadUpdateRanks,
} from "./user-story.interface";

const urlRoot = "http://localhost:3001/user-story";

const getByPlanningPokerId = async ({
  planningPokerId,
}: UserStoryPayloadGetAllByPlanningPokerId) => {
  const { data } = await axios.get(
    `${urlRoot}/by-planning-poker/${planningPokerId}`
  );
  return data as UserStoryFromApi[];
};

const create = async ({ planningPokerId }: UserStoryPayloadCreate) => {
  const { data } = await axios.post(`${urlRoot}/create`, {
    planningPokerId,
    title: "test",
  });
  return data as UserStoryFromApi;
};

const update = async ({ userStory }: UserStoryPayloadUpdate) => {
  const { data } = await axios.put(`${urlRoot}/update`, {
    ...userStory,
  });
  return data as UserStoryFromApi;
};

const remove = async ({ userStoryId }: UserStoryPayloadRemove) => {
  const { data } = await axios.delete(`${urlRoot}/delete/${userStoryId}`);
  return data as UserStoryFromApi;
};

const updateRanks = async (values: UserStoryPayloadUpdateRanks[]) => {
  const { data } = await axios.put(`${urlRoot}/update-ranks`, values);
  return data as any;
};

const userStoryService = {
  getByPlanningPokerId,
  create,
  update,
  remove,
  updateRanks,
};

export default userStoryService;
