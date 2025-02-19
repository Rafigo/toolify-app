import { UserStoryForm } from "@/models/planning-poker.model";
import { updatePlanningPoker } from "@/services/planning-poker/planning-poker.service";
import userStoryService from "@/services/user-story/user-story.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const usePlanningPokerFormHook = (planningPokerId: string) => {
  const queryClient = useQueryClient();

  const useUpdatePlanningPoker = useMutation({
    mutationFn: updatePlanningPoker,
    // When mutate is called:
    onMutate: async (nextPlanningPokerValues) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ["updatePlanningPoker", planningPokerId],
      });

      // Snapshot the previous value
      const previousPlanningPokerValues = queryClient.getQueryData([
        "updatePlanningPoker",
        planningPokerId,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(
        ["updatePlanningPoker", planningPokerId],
        nextPlanningPokerValues
      );

      // Return a context with the previous and new todo
      return { previousPlanningPokerValues, nextPlanningPokerValues };
    },
    // If the mutation fails, use the context we returned above
    onError: (err, nextPlanningPokerValues, context) => {
      if (context) {
        queryClient.setQueryData(
          ["updatePlanningPoker", context.nextPlanningPokerValues.id],
          context.previousPlanningPokerValues
        );
      }
    },
    // Always refetch after error or success:
    onSettled: (nextPlanningPokerValues) => {
      if (nextPlanningPokerValues) {
        queryClient.invalidateQueries({
          queryKey: ["updatePlanningPoker", nextPlanningPokerValues.id],
        });
      }
    },
  });

  const useCreateUserStory = useMutation({
    mutationFn: async (planningPokerId: string) => {
      return userStoryService.create({ planningPokerId });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      console.error("Echec de la création de la user story:", error);
    },
  });

  const useUpdateUserStory = useMutation({
    mutationFn: async (userStory: UserStoryForm) => {
      return userStoryService.update({ userStory });
    },
    onSuccess: async () => {
      // queryClient.invalidateQueries({ queryKey: ["getPlanningPokerById"] });
    },
    onError: (error) => {
      console.error("Echec de la création de la user story:", error);
    },
  });

  const useRemoveUserStory = useMutation({
    mutationFn: async (userStoryId: string) => {
      return userStoryService.remove({ userStoryId });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      console.error("Echec de la suppression de la user story:", error);
    },
  });

  return {
    useUpdatePlanningPoker,
    useCreateUserStory,
    useUpdateUserStory,
    useRemoveUserStory,
  };
};

export default usePlanningPokerFormHook;
