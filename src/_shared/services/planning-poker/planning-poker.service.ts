import axios from "axios";

import { PlanningPokerFromApi } from "@/models/planning-poker.model";
import {
  PlanningPokerPayloadCreate,
  PlanningPokerPayloadGetById,
  PlanningPokerPayloadRemove,
  PlanningPokerPayloadUpdate,
} from "./planning-poker.interface";

const urlRoot = "http://localhost:3001/planning-poker";

export const getAllPlanningPoker = async () => {
  const { data } = await axios.get(
    "http://localhost:3001/planning-poker/find-all"
  );
  return data as PlanningPokerFromApi[];
};

export const getById = async ({
  planningPokerId,
}: PlanningPokerPayloadGetById) => {
  const { data } = await axios.get(`${urlRoot}/find-one/${planningPokerId}`);
  return data as PlanningPokerFromApi;
};

export const create = async ({ title }: PlanningPokerPayloadCreate) => {
  const { data } = await axios.post(`${urlRoot}/create`, { title });
  return data as PlanningPokerFromApi;
};

export const update = async ({
  id,
  title,
  description,
}: PlanningPokerPayloadUpdate) => {
  const { data } = await axios.put(`${urlRoot}/update`, {
    id,
    title,
    description,
  });
  return data as PlanningPokerFromApi;
};

export const remove = async ({
  planningPokerId,
}: PlanningPokerPayloadRemove) => {
  const { data } = await axios.delete(`${urlRoot}/${planningPokerId}`);
  return data as PlanningPokerFromApi;
};

const planningPokerService = {
  getById,
  create,
  update,
  remove,
};

export default planningPokerService;
