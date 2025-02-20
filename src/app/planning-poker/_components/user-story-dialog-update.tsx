"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, Pencil, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
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
import { updateUserStorySchema } from "../_libs/planning-poker";
import { UserStoryForm } from "@/models/planning-poker.model";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useUpdateUserStory } from "../_hooks/user-story.hook";

interface UserStoryDialogUpdateProps {
  userStory: UserStoryForm;
}

const UserStoryDialogUpdate = ({ userStory }: UserStoryDialogUpdateProps) => {
  const [open, setOpen] = useState(false);

  const { isError, isPending, mutate, reset, isSuccess } = useUpdateUserStory();

  const form = useForm<z.infer<typeof updateUserStorySchema>>({
    resolver: zodResolver(updateUserStorySchema),
  });

  const onSubmit = useCallback(() => {
    mutate(form.getValues());
  }, [mutate, form]);

  useEffect(() => {
    return () => {
      if (!open) {
        form.reset();
        reset();
      }
    };
  }, [open, reset, form]);

  useEffect(() => {
    form.reset({
      ...userStory,
    });
  }, [userStory]);

  useEffect(() => {
    // Use setTimeout to update the message after 2000 milliseconds (2 seconds)
    const timeoutId = setTimeout(() => {
      reset();
    }, 1000);

    // Cleanup function to clear the timeout if the component unmounts
    return () => clearTimeout(timeoutId);
  }, [isSuccess, reset]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="ghost" title="Modifier la user story">
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <Form {...form}>
          <DialogHeader>
            <DialogTitle>Edition d&apos;une user story</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 w-full">
            <div className="flex flex-col gap-4 bg-gray-50 p-4 rounded-md">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="title" className="pb-2">
                      Titre
                    </Label>
                    <FormControl>
                      <Input
                        placeholder="Titre de la user story"
                        {...field}
                        readOnly={isPending}
                        disabled={isPending}
                        className="bg-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="description" className="pb-2">
                      Description
                    </Label>
                    <FormControl>
                      <Textarea
                        placeholder="Description de la user story"
                        {...field}
                        readOnly={isPending}
                        disabled={isPending}
                        className="bg-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="value" className="pb-2">
                      Estimation
                    </Label>
                    <FormControl>
                      <Input
                        placeholder="Estimation de la user story"
                        {...field}
                        readOnly={isPending || isSuccess}
                        disabled={isPending}
                        type="number"
                        className="bg-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <DialogFooter>
            <div className="flex items-center justify-center gap-4">
              {isError || isPending || isSuccess ? (
                <span className="text-sm text-left">
                  {isPending &&
                    "Modification de la user story en cours, merci de patienter quelques instants."}
                  {isError && "La modification de la user story a échoué."}
                  {isSuccess && "La user story a été modifiée avec succès."}
                </span>
              ) : (
                <>
                  <DialogClose asChild>
                    <Button
                      type="button"
                      title="Fermer"
                      variant="outline"
                      disabled={isPending}
                    >
                      <X />
                      &nbsp; Fermer
                    </Button>
                  </DialogClose>
                  <Button
                    type="button"
                    onClick={onSubmit}
                    title="Sauvegarder les modifications de la user story"
                    disabled={isPending}
                  >
                    <Check />
                    &nbsp; Modifier
                  </Button>
                </>
              )}
            </div>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserStoryDialogUpdate;
