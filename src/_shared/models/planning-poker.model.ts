// Enum
export enum EnumPlanningPokerStatus {
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  CANCELED = "CANCELED",
  FINISHED = "FINISHED",
  ARCHIVED = "ARCHIVED",
}

// From API
export type PlanningPokerFromApi = {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: EnumPlanningPokerStatus;
  tags: string[];
  createdAt: Date;
  deletedAt: Date;
  modifiedAt: Date;
  sessionUrl: string;
  userStories: UserStoryFromApi[];
};

export type UserStoryFromApi = {
  id: string;
  planningPokerId: string;
  title: string;
  description: string;
  value: string;
  rank: string;
  createdAt: Date;
  modifiedAt: Date;
};

// Front form
export type PlanningPokerForm = {
  id: string;
  title: string;
  description: string;
  tags: { value: string }[];
  userStories: UserStoryForm[];
};

export type UserStoryForm = {
  id: string;
  title: string;
  description: string;
  value: string;
  rank: string;
};

// Components interface
