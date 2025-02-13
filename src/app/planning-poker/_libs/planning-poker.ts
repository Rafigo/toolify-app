import { z } from "zod";
import { PlanningPokerForm } from "@/models/planning-poker.model";

export const initPlanningPokerSchema: z.ZodType<{ title: string }> = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
});

export const planningPokerSchema: z.ZodType<PlanningPokerForm> = z.object({
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
  stories: z.array(
    z.object({
      id: z.string().min(0),
      planningPokerId: z.string().min(0),
      title: z
        .string()
        .min(5, { message: "Title must be at least 5 characters." }),
      description: z.string().min(0),
      value: z.number().min(0),
      rank: z.number().min(0),
      createdAt: z.date(),
      modifiedAt: z.date(),
    })
  ),
});
