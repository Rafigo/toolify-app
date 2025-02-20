"use client";

import { z } from "zod";
import { useCallback } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { planningPokerSchema } from "../_libs/planning-poker";
import { useMutation } from "@tanstack/react-query";
import { createUserStory } from "@/services/user-story/user-story.service";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";

const TagsForm = () => {
  const intl = useTranslations("PlanningPoker.Edition");

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

  const { control, getValues, register, resetField } = useFormContext<
    z.infer<typeof planningPokerSchema> & { newItem?: string }
  >();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tags",
  });

  const addTag = useCallback(
    (e: React.KeyboardEvent) => {
      // mutate(getValues("id"));

      if (e.key === "Enter") {
        e.preventDefault();
        const newValue = (e.currentTarget as HTMLInputElement).value.trim();
        if (newValue) {
          append({ value: newValue }); // Ajoute la nouvelle valeur
          resetField("newItem"); // Réinitialise le champ
        }
      }
    },
    [mutate, getValues]
  );

  const removeTag = (index: number) => remove(index);

  return (
    <div className="grid w-full items-center gap-1.5">
      <Label htmlFor="newTag" className="pb-2">
        {intl("form.fields.tags.label")}
      </Label>
      <Input
        type="text"
        id="newTag"
        placeholder={intl("form.fields.tags.placeholder")}
        onKeyDown={addTag}
        className="max-w-xs mb-1"
        {...register("newItem")}
      />
      <div className="flex gap-2">
        {fields.map((tag, index) => (
          <div
            key={`tag-${index}`}
            className="w-fit p-1 rounded-sm flex items-center gap-2 text-sm bg-blue-50 hover:cursor-pointer hover:bg-red-50"
            onClick={() => removeTag(index)}
          >
            <X size="16px" /> {tag.value}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagsForm;
