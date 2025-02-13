import axios from "axios";

import { PlanningPokerFromApi } from "@/models/planning-poker.model";

export const getAllPlanningPoker = async () => {
  const { data } = await axios.get(
    "http://localhost:3001/planning-poker/find-all"
  );
  return data as PlanningPokerFromApi[];
};

interface InitPlanningPoker {
  title: string;
}

export const initPlanningPoker = async ({ title }: InitPlanningPoker) => {
  const { data } = await axios.post(
    "http://localhost:3001/planning-poker/create",
    { title }
  );
  return data as PlanningPokerFromApi;
};

export const remove = async ({ id }: { id: string }) => {
  const { data } = await axios.delete(
    `http://localhost:3001/planning-poker/delete/${id}`
  );
  return data as PlanningPokerFromApi;
};
