"use client";

import { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Ban, Check, Plus, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { initPlanningPokerSchema } from "../_libs/planning-poker";
import { useMutation } from "@tanstack/react-query";
import { initPlanningPoker } from "@/services/planning-poker/planning-poker.service";
import { redirect } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const PlanningPokerDialogCreate = () => {
  const [open, setOpen] = useState(false);

  const { isPending, isSuccess, isError, mutate, reset } = useMutation({
    mutationFn: async (value: { title: string }) => {
      return initPlanningPoker(value);
    },
    onSuccess: async (value) => {
      setTimeout(() => {
        redirect(`/planning-poker/admin/edition/${value.id}`);
      }, 3000);
    },
    onError: (error) => {
      console.error("Erreur lors de la soumission:", error);
    },
  });

  const form = useForm<
    z.infer<typeof initPlanningPokerSchema> & { newItem?: string }
  >({
    resolver: zodResolver(initPlanningPokerSchema),
    defaultValues: {
      title: "",
    },
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<{ title: string }> = useCallback(
    (data) => {
      mutate({ title: data.title });
    },
    [mutate]
  );

  useEffect(() => {
    return () => {
      if (!open) {
        form.reset();
        reset();
      }
    };
  }, [open, reset, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="text-white" />
          &nbsp;Nouveau planning poker
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <DialogHeader>
              <DialogTitle>Nouveau planning poker</DialogTitle>
              <DialogDescription>
                Renseignez un nom, puis cliquez sur valider pour accéder au
                formulaire de configuration
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-6 gap-4 w-full">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="col-span-4">
                    <FormControl>
                      <Input
                        placeholder="Titre du planning poker"
                        {...field}
                        readOnly={isPending || isSuccess}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                onSubmit={form.handleSubmit(onSubmit)}
                title="Créer planning poker"
                className="col-span-2"
                disabled={isPending || isSuccess}
              >
                <Check />
                &nbsp; Créer
              </Button>
            </div>
            <DialogFooter className="sm:justify-start">
              {(isError || isPending || isSuccess) && (
                <Alert variant={isError ? "destructive" : "default"}>
                  {isPending && <RefreshCcw className="h-4 w-4" />}
                  {isError && <Ban className="h-4 w-4" />}
                  {isSuccess && <Check className="h-4 w-4" />}
                  <AlertTitle>
                    {isPending && "Traitement en cours"}
                    {isError && "Echec"}
                    {isSuccess && "Succès"}
                  </AlertTitle>
                  <AlertDescription>
                    {isPending &&
                      "Création du planning poker en cours, merci de patienter quelques instants."}
                    {isError && "La création du planning poker a échoué."}
                    {isSuccess && "Le planning poker a été créé avec succès."}
                  </AlertDescription>
                </Alert>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PlanningPokerDialogCreate;
