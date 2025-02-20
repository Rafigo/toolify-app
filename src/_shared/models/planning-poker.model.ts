// Enum
export enum EnumPlanningPokerStatus {
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  CANCELED = "CANCELED",
  FINISHED = "FINISHED",
  ARCHIVED = "ARCHIVED",
}
export enum EnumUserStoryStatus {
  TODO = "TODO",
  ONGOING = "ONGOING",
  DONE = "DONE",
  CANCELLED = "CANCELLED",
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
  updatedAt: Date;
  sessionUrl: string;
  userStories: UserStoryFromApi[];
};

export type UserStoryFromApi = {
  id: string;
  title: string;
  description: string;
  value: string;
  rank: string;
  createdAt: Date;
  modifiedAt: Date;
  updatedAt: Date;
  status: EnumUserStoryStatus;
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

// Payload to the backend
