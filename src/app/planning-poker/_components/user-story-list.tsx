"use client";

import { z } from "zod";
import { CircleAlert, GripVertical, Info, Plus, Trash } from "lucide-react";
import { useCallback, useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { planningPokerSchema } from "../_libs/planning-poker";
import { useToast } from "@/hooks/use-toast";
import usePlanningPokerFormHook from "../_hooks/planning-poker-form.hook";
import UserStoryDialogUpdate from "./user-story-dialog-update";

interface UserStoriesFormProps {
  disabled: boolean;
}

const UserStoriesForm = ({ disabled }: UserStoriesFormProps) => {
  const { toast } = useToast();

  const { useCreateUserStory, useRemoveUserStory } = usePlanningPokerFormHook();

  const { control, getValues } =
    useFormContext<z.infer<typeof planningPokerSchema>>();

  const { fields } = useFieldArray({
    control,
    name: "userStories",
    keyName: "userStoryId",
  });

  const addStory = useCallback(() => {
    useCreateUserStory.mutate(getValues("id"));
  }, [useCreateUserStory, getValues]);

  const removeStory = (userStoryId: string) =>
    useRemoveUserStory.mutate(userStoryId);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "u" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        useCreateUserStory.mutate(getValues("id"));
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [useCreateUserStory, getValues]);

  useEffect(() => {
    // user story creation handling
    if (useCreateUserStory.isError) {
      toast({
        icon: <CircleAlert />,
        title: "Erreur",
        description: "La user story n'a pas été créée",
        variant: "destructive",
      });
    }

    // user story creation handling
    if (useRemoveUserStory.isError) {
      toast({
        icon: <CircleAlert />,
        title: "Erreur",
        description: "La user story n'a pas été supprimée",
        variant: "destructive",
      });
    }
  }, [toast, useCreateUserStory.isError, useRemoveUserStory.isError]);

  return (
    <>
      <div className="flex justify-between items-center sticky top-0 bg-white z-10">
        <div className="flex items-center gap-2">
          <h2 className="text-gray-900 font-semibold">User stories</h2>
          <span className="text-xs hidden sm:block">({fields.length})</span>
        </div>
        <Button
          variant="outline"
          type="button"
          onClick={addStory}
          disabled={disabled}
        >
          <Plus />
          &nbsp;Ajouter une story
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>U
          </kbd>
        </Button>
      </div>
      {fields.length === 0 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Aucune user story</AlertTitle>
          <AlertDescription>Lancez vous !</AlertDescription>
        </Alert>
      )}
      <div className="flex flex-col gap-2">
        {fields.map((story, index) => (
          <div
            key={`user-story-${story.id}`}
            className="p-2 border rounded-lg odd:bg-gray-50 flex flex-col w-full gap-2 sm:grid sm:grid-cols-8 md:gap-0"
          >
            <div className="flex items-center gap-1 col-span-6 sm:col-span-6">
              <GripVertical size={20} className="hover:cursor-move" />
              <FormField
                control={control}
                name={`userStories.${index}.title`}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Titre de ma user story"
                        className="bg-white"
                        {...field}
                        disabled={disabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center justify-end col-span-1 sm:col-span-2">
              <UserStoryDialogUpdate userStory={story} />
              <Button
                variant="ghost"
                title="Supprimer cette story"
                onClick={() => removeStory(story.id)}
                type="button"
                disabled={disabled}
              >
                <Trash />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default UserStoriesForm;
