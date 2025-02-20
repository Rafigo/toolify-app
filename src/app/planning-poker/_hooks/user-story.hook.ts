import { UserStoryForm } from "@/models/planning-poker.model";
import userStoryService from "@/services/user-story/user-story.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const USER_STORIES_QUERY_KEY = "getUserStoriesByPlanningPokerId";

export const useGetUserStoriesByPlanningPokerId = () => {
  const { id } = useParams<{ id: string }>();

  return useQuery({
    queryKey: ["getUserStoriesByPlanningPokerId", id],
    queryFn: async () => {
      const data = await userStoryService.getByPlanningPokerId({
        planningPokerId: id,
      });
      return data;
    },
    refetchOnWindowFocus: false,
    staleTime: 0, // Consider the data stale immediately
  });
};

export function useCreateUserStory() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const data = await userStoryService.create({ planningPokerId: id });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [USER_STORIES_QUERY_KEY, id],
      });
    },
  });
}

export function useUpdateUserStory() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userStory: UserStoryForm) => {
      const data = await userStoryService.update({ userStory });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [USER_STORIES_QUERY_KEY, id],
      });
    },
  });
}

export function useRemoveUserStory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userStoryId: string) => {
      const data = await userStoryService.remove({ userStoryId });
      return data;
    },
    onSuccess: (_, planningPokerId) => {
      queryClient.invalidateQueries({
        queryKey: [USER_STORIES_QUERY_KEY, planningPokerId],
      });
    },
  });
}

export function useUpdateUserStoryRanks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      userStories: { userStoryId: string; rank: string }[]
    ) => {
      const response = await userStoryService.updateRanks(userStories);
      return response.data;
    },
    onSuccess: (_, planningPokerId) => {
      queryClient.invalidateQueries({
        queryKey: [USER_STORIES_QUERY_KEY, planningPokerId],
      });
    },
  });
}
