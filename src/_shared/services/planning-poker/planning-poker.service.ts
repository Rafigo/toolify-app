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
    "http://localhost:3001/planning-poker/createlp",
    { title }
  );
  return data as PlanningPokerFromApi;
};
