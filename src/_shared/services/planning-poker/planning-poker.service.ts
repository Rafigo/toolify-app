import axios from "axios";

import { PlanningPokerFromApi } from "@/models/planning-poker.model";

interface GetPlanningPokerByIdProps {
  id: string;
}

interface InitPlanningPoker {
  title: string;
}

export interface UpdatePlanningPokerPayload {
  id: string;
  title: string;
  description: string;
}

export const getAllPlanningPoker = async () => {
  const { data } = await axios.get(
    "http://localhost:3001/planning-poker/find-all"
  );
  return data as PlanningPokerFromApi[];
};

export const getPlanningPokerById = async ({
  id,
}: GetPlanningPokerByIdProps) => {
  const { data } = await axios.get(
    `http://localhost:3001/planning-poker/find-one/${id}`
  );
  return data as PlanningPokerFromApi;
};

/**
 * Initializes a new Planning Poker session by sending a POST request to the server.
 *
 * @param {InitPlanningPoker} param - The initialization parameters for the Planning Poker session.
 * @param {string} param.title - The title of the Planning Poker session.
 * @returns {Promise<PlanningPokerFromApi>} A promise that resolves to the data returned from the API.
 */
export const initPlanningPoker = async ({ title }: InitPlanningPoker) => {
  const { data } = await axios.post(
    "http://localhost:3001/planning-poker/create",
    { title }
  );
  return data as PlanningPokerFromApi;
};

/**
 * Removes a planning poker item by its ID.
 *
 * @param {Object} params - The parameters for the remove function.
 * @param {string} params.id - The ID of the planning poker item to be removed.
 * @returns {Promise<PlanningPokerFromApi>} The data returned from the API after deletion.
 */
export const remove = async ({ id }: { id: string }) => {
  const { data } = await axios.delete(
    `http://localhost:3001/planning-poker/delete/${id}`
  );
  return data as PlanningPokerFromApi;
};

export const updatePlanningPoker = async ({
  id,
  title,
  description,
}: UpdatePlanningPokerPayload) => {
  const { data } = await axios.put(
    "http://localhost:3001/planning-poker/update",
    { id, title, description }
  );
  return data as PlanningPokerFromApi;
};
