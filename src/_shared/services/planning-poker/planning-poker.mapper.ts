import { PlanningPokerFromApi } from "@/models/planning-poker.model";

export const mapPlanningPokerObject = (
  planningPokers: PlanningPokerFromApi[]
) => {
  return planningPokers.map((planningPoker) => planningPoker);
};
