import { mapPlanningPokerObject } from "@/services/planning-poker/planning-poker.mapper";
import planningPokerService from "@/services/planning-poker/planning-poker.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export const useGetPlanningPokerById = () => {
  const { id } = useParams<{ id: string }>();
  return useQuery({
    queryKey: ["getPlanningPokerById", id],
    queryFn: async () => {
      const data = await planningPokerService.getById({
        planningPokerId: id,
      });
      return mapPlanningPokerObject(data);
    },
  });
};

export const useUpdatePlanningPoker = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: planningPokerService.update,
    // When mutate is called:
    onMutate: async (nextPlanningPokerValues) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ["updatePlanningPoker", id],
      });

      // Snapshot the previous value
      const previousPlanningPokerValues = queryClient.getQueryData([
        "updatePlanningPoker",
        id,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(
        ["updatePlanningPoker", id],
        nextPlanningPokerValues
      );

      // Return a context with the previous and new todo
      return { previousPlanningPokerValues, nextPlanningPokerValues };
    },
    // If the mutation fails, use the context we returned above
    onError: (err, nextPlanningPokerValues, context) => {
      if (context) {
        queryClient.setQueryData(
          ["updatePlanningPoker", context.nextPlanningPokerValues],
          context.previousPlanningPokerValues
        );
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["updatePlanningPoker", data.id], data);
    },
  });
};
