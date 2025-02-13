"use client";

import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowDownToLine,
  CopyPlus,
  GripVertical,
  Info,
  Plus,
  Trash,
  X,
} from "lucide-react";
import { planningPokerSchema } from "../../../_libs/planning-poker";
import {
  PlanningPokerForm,
  UserSroryForm,
} from "@/models/planning-poker.model";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { uuidv4 } from "@/libs/utils";
import { useCallback, useEffect } from "react";
import Accordion from "@/components/accordion/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const EditionPage = () => {
  const form = useForm<
    z.infer<typeof planningPokerSchema> & { newItem?: string }
  >({
    resolver: zodResolver(planningPokerSchema),
    defaultValues: {
      id: "new-planning-poker",
      title: "",
      stories: [],
      tags: [],
      description: "",
    },
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<PlanningPokerForm> = useCallback((data) => {
    console.log(data);
  }, []);

  const {
    fields: storiesFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "stories",
  });

  const addStory = useCallback(() => {
    append({
      id: uuidv4(),
      planningPokerId: "",
      title: "",
      description: "",
      value: 0,
      rank: 0,
      createdAt: new Date(),
      modifiedAt: new Date(),
    });
  }, [append]);

  const duplicateStory = (story: UserSroryForm) =>
    append({
      ...story,
      id: uuidv4(),
    });

  const removeStory = (index: number) => remove(index);

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
    const down = (e: KeyboardEvent) => {
      if (e.key === "u" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        addStory();
      } else if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        form.handleSubmit(onSubmit)();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [addStory, form, onSubmit]);

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
              <Button variant="ghost" title="Supprimer ce planning poker">
                <Trash />
                &nbsp;Supprimer
              </Button>
              <Button variant="outline" title="Dupliquer ce planning poker">
                <CopyPlus />
                &nbsp;Dupliquer
              </Button>
              <Button
                title="Sauvegarder ce planning poker"
                type="submit"
                onSubmit={form.handleSubmit(onSubmit)}
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
            <div className="flex justify-between items-center sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <h2 className="text-gray-900 font-semibold">User stories</h2>
                <span className="text-xs">({storiesFields.length})</span>
              </div>
              <Button variant="outline" type="button" onClick={addStory}>
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
                        control={form.control}
                        name={`stories.${index}.title`}
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Titre de ma user story"
                                className="bg-white w-full"
                                {...field}
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
                        >
                          <CopyPlus />
                        </Button>
                        <Button
                          variant="ghost"
                          title="Supprimer cette story"
                          onClick={() => removeStory(index)}
                          type="button"
                        >
                          <Trash />
                        </Button>
                      </>
                    }
                    accordionContent={
                      <div className="col-span-2 w-full items-center gap-1.5">
                        <Textarea
                          id="description"
                          placeholder="Description ma user story"
                          className="bg-white"
                        />
                      </div>
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditionPage;
