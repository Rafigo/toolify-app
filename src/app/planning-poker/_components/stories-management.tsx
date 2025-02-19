"use client";

import { z } from "zod";
import { CopyPlus, GripVertical, Info, Plus, Trash } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import Accordion from "@/components/accordion/accordion";
import { uuidv4 } from "@/libs/utils";
import { UserSroryForm } from "@/models/planning-poker.model";
import { planningPokerSchema } from "../_libs/planning-poker";
import { useMutation } from "@tanstack/react-query";
import { createUserStory } from "@/services/user-story/user-story.service";

interface UserStoriesFormProps {
  disabled: boolean;
}

const UserStoriesForm = ({ disabled }: UserStoriesFormProps) => {
  const { mutate } = useMutation({
    mutationFn: async (id: string) => {
      return createUserStory({ planningPokerId: id });
    },
    onSuccess: async (value) => {
      setTimeout(() => {
        console.log("value", value);
      }, 3000);
    },
    onError: (error) => {
      console.error("Echec de la création de la user story:", error);
    },
  });

  const { control, getValues } = useFormContext<
    z.infer<typeof planningPokerSchema> & { newItem?: string }
  >();

  const {
    fields: storiesFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "userStories",
  });

  const addStory = useCallback(() => {
    mutate(getValues("id"));
  }, [mutate, getValues]);

  const duplicateStory = (story: UserSroryForm) =>
    append({
      ...story,
      id: uuidv4(),
    });

  const removeStory = (index: number) => remove(index);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "u" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        mutate(getValues("id"));
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [mutate, getValues]);

  return (
    <>
      <div className="flex justify-between items-center sticky top-0 bg-white z-10">
        <div className="flex items-center gap-2">
          <h2 className="text-gray-900 font-semibold">User stories</h2>
          <span className="text-xs">({storiesFields.length})</span>
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
      {storiesFields.length === 0 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Aucune user story</AlertTitle>
          <AlertDescription>Lancez vous !</AlertDescription>
        </Alert>
      )}
      <div className="flex flex-col gap-2">
        {storiesFields.map((story, index) => (
          <div
            key={`user-story-${story.id}`}
            className="px-4 py-2 border rounded-lg odd:bg-gray-50 flex items-center gap-2"
          >
            <GripVertical size={20} className="hover:cursor-move" />
            <Accordion
              className="flex-grow"
              accordionHeader={
                <FormField
                  control={control}
                  name={`userStories.${index}.title`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Titre de ma user story"
                          className="bg-white w-full"
                          {...field}
                          disabled={disabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              }
              accordionActions={
                <>
                  <Button
                    variant="ghost"
                    title="Dupliquer cette story"
                    onClick={() => duplicateStory(story)}
                    type="button"
                    disabled={disabled}
                  >
                    <CopyPlus />
                  </Button>
                  <Button
                    variant="ghost"
                    title="Supprimer cette story"
                    onClick={() => removeStory(index)}
                    type="button"
                    disabled={disabled}
                  >
                    <Trash />
                  </Button>
                </>
              }
              accordionContent={
                <div className="col-span-2 w-full items-center gap-1.5">
                  <FormField
                    control={control}
                    name={`userStories.${index}.description`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Textarea
                            placeholder="Titre de ma user story"
                            className="bg-white w-full"
                            {...field}
                            disabled={disabled}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              }
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default UserStoriesForm;
