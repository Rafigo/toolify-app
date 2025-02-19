"use client";

import Actionvalidation, {
  ChildDialogRef,
} from "@/components/action-validation/action-validation";
import { PlanningPokerFromApi } from "@/models/planning-poker.model";
import { remove } from "@/services/planning-poker/planning-poker.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { useRef } from "react";

interface PlanningPokerDialogDeleteProps {
  planningPoker: PlanningPokerFromApi;
}

const PlanningPokerDialogDelete = ({
  planningPoker,
}: PlanningPokerDialogDeleteProps) => {
  const queryClient = useQueryClient();

  // Création d'une ref pour contrôler l'enfant
  const dialogRef = useRef<ChildDialogRef>(null);

  const { mutate, isError, isPending, isSuccess, reset } = useMutation({
    mutationFn: async (value: { id: string }) => {
      return remove({ id: value.id });
    },
    onSuccess: async () => {
      dialogRef.current?.close();
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      console.error("Erreur lors de la soumission:", error);
    },
  });

  const title = <>Suppression d&apos;un planning poker</>;

  const description = (
    <div className="flex flex-col gap-2 text-center bg-red-50 p-2 text-gray-800 rounded-md">
      <span>Vous êtes sur le point de supprimer le planning poker :</span>
      <span className="font-semibold">{planningPoker.title}</span>
      <span>Voulez-vous continuer ?</span>
    </div>
  );

  return (
    <Actionvalidation
      title={title}
      description={description}
      buttonLabel=""
      buttonTitle="Supprimer planning poker"
      icon={<Trash />}
      onValidate={() => mutate({ id: planningPoker.id })}
      ref={dialogRef}
      isError={isError}
      isPending={isPending}
      isSuccess={isSuccess}
      onClose={reset}
    />
  );
};

export default PlanningPokerDialogDelete;
