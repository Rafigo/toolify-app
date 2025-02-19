import { updatePlanningPoker } from "@/services/planning-poker/planning-poker.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useUpdatePlanningPoker = (planningPokerId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
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
};

export default useUpdatePlanningPoker;
