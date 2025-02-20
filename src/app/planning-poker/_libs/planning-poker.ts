import { z } from "zod";
import {
  PlanningPokerForm,
  UserStoryForm,
} from "@/models/planning-poker.model";

export const initPlanningPokerSchema: z.ZodType<{ title: string }> = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
});

const userStorySchemaObject = {
  id: z.string().min(0),
  title: z.string().min(0),
  description: z.string().min(0).or(z.literal("")),
  value: z.string().min(0).or(z.literal("")),
  rank: z.string().min(0),
};

export const updatePlanningPokerSchema: z.ZodType<PlanningPokerForm> = z.object(
  {
    id: z.string(),
    title: z.string().min(5, {
      message: "Title must be at least 5 characters.",
    }),
    description: z.string(),
    tags: z.array(
      z.object({
        value: z.string(),
      })
    ),
    userStories: z.array(z.object(userStorySchemaObject)),
  }
);

export const updateUserStorySchema: z.ZodType<UserStoryForm> = z.object(
  userStorySchemaObject
);
