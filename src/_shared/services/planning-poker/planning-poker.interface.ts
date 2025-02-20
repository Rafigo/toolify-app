export interface PlanningPokerPayloadGetById {
  planningPokerId: string;
}

export interface PlanningPokerPayloadCreate {
  title: string;
}

export interface PlanningPokerPayloadUpdate {
  id: string;
  title: string;
  description: string;
}

export interface PlanningPokerPayloadRemove {
  planningPokerId: string;
}
