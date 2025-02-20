import {
  PlanningPokerForm,
  PlanningPokerFromApi,
} from "@/models/planning-poker.model";

export const mapPlanningPokerObject = (
  planningPoker: PlanningPokerFromApi
): PlanningPokerForm => {
  return {
    ...planningPoker,
    tags: planningPoker.tags?.map((tag) => ({ value: tag })) ?? [],
  };
};
