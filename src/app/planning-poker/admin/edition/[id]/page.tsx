"use client";

import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ArrowDownToLine, CopyPlus, Trash, X } from "lucide-react";
import { planningPokerSchema } from "../../../_libs/planning-poker";
import { PlanningPokerForm } from "@/models/planning-poker.model";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPlanningPokerById } from "@/services/planning-poker/planning-poker.service";
import { useParams } from "next/navigation";
import useUpdatePlanningPoker from "@/hooks/usePlanningPoker";
import UserStoriesForm from "app/planning-poker/_components/stories-management";

const EditionPage = () => {
  const id = useParams<{ id: string }>();

  const {
    mutate,
    isError: mutateError,
    isPending: mutationPending,
  } = useUpdatePlanningPoker(id.id);

  const { data, error, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ["getPlanningPokerById", id],
    queryFn: async () => {
      const data = await getPlanningPokerById(id);
      return data;
    },
  });

  const form = useForm<
    z.infer<typeof planningPokerSchema> & { newItem?: string }
  >({
    resolver: zodResolver(planningPokerSchema),
    defaultValues: {
      id: "new-planning-poker",
      title: "",
      userStories: [],
      tags: [],
      description: "",
    },
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<PlanningPokerForm> = useCallback(
    (data) => {
      mutate({ id: id.id, title: data.title, description: data.description });
    },
    [id.id, mutate]
  );

  // Tags
  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({
    control: form.control,
    name: "tags",
  });

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newValue = (e.currentTarget as HTMLInputElement).value.trim();
      if (newValue) {
        appendTag({ value: newValue }); // Ajoute la nouvelle valeur
        form.resetField("newItem"); // Réinitialise le champ
      }
    }
  };

  useEffect(() => {
    if (data) {
      form.setValue("id", data?.id);
      form.setValue("title", data?.title);
      form.setValue(
        "description",
        data.description && data.description !== "" ? data.description : ""
      );
      form.setValue("userStories", data.userStories);
    }
  }, [data, isLoading, form]);

  useEffect(() => {
    if (mutateError) {
      console.log("error");
    }
  }, [mutateError]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        form.handleSubmit(onSubmit)();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [form, onSubmit]);

  const isFormPending = isLoading || mutationPending;

  return (
    <div className="pb-10">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col bg-white border rounded-xl"
        >
          <div className="flex justify-between items-center p-8">
            <h1 className="text-gray-900 text-lg">
              Configurer un planning poker
            </h1>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                title="Supprimer ce planning poker"
                disabled={isFormPending}
              >
                <Trash />
                &nbsp;Supprimer
              </Button>
              <Button
                variant="outline"
                title="Dupliquer ce planning poker"
                disabled={isFormPending}
              >
                <CopyPlus />
                &nbsp;Dupliquer
              </Button>
              <Button
                title="Sauvegarder ce planning poker"
                type="submit"
                onSubmit={form.handleSubmit(onSubmit)}
                disabled={isFormPending}
              >
                <ArrowDownToLine />
                &nbsp;Sauvegarder
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-gray-800 px-1.5 font-mono text-[10px] font-medium">
                  <span className="text-xs">⌘</span>S
                </kbd>
              </Button>
            </div>
          </div>
          <Separator />
          <div className="p-8">
            <h2 className="text-gray-900 font-semibold">
              Informations générales
            </h2>
            <div className="grid grid-cols-1 gap-8 mt-4">
              <div className="grid w-full max-w-md items-center gap-1.5">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Titre</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Titre du planning poker"
                          {...field}
                          disabled={isFormPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Description du planning poker"
                          {...field}
                          disabled={isFormPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="newTag" className="pb-2">
                  Tag(s)
                </Label>
                <Input
                  type="text"
                  id="newTag"
                  placeholder="Ajouter un tag"
                  onKeyDown={addTag}
                  className="max-w-xs mb-1"
                  {...form.register("newItem")}
                  disabled={isFormPending}
                />
                <div className="flex gap-2">
                  {tagFields.map((tag, index) => (
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
            </div>
          </div>
          <Separator />
          <div className="p-8 flex flex-col gap-4">
            <UserStoriesForm disabled={isFormPending} />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditionPage;
