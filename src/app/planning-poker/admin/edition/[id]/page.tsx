"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ArrowDownToLine, CopyPlus, Trash } from "lucide-react";
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
import UserStoriesForm from "app/planning-poker/_components/user-story-list";
import { useTranslations } from "next-intl";
import TagsForm from "app/planning-poker/_components/tags-management";
import usePlanningPokerFormHook from "app/planning-poker/_hooks/planning-poker-form.hook";

const EditionPage = () => {
  const intl = useTranslations("PlanningPoker.Edition");
  const id = useParams<{ id: string }>();

  const { useUpdatePlanningPoker } = usePlanningPokerFormHook(id.id);
  const { mutate } = useUpdatePlanningPoker;

  const { data, isLoading } = useQuery({
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
  });

  const onSubmit: SubmitHandler<PlanningPokerForm> = useCallback(
    (data) => {
      console.log("is here");
      mutate({ id: id.id, title: data.title, description: data.description });
    },
    [id.id, mutate]
  );

  useEffect(() => {
    if (data) {
      console.log("here");
      form.setValue("id", data?.id);
      form.setValue("title", data?.title);
      form.setValue(
        "description",
        data.description && data.description !== "" ? data.description : ""
      );
      form.setValue(
        "userStories",
        data.userStories.map((userStory) => ({
          ...userStory,
          title:
            userStory.title && userStory.title !== "" ? userStory.title : "",
          description:
            userStory.description && userStory.description !== ""
              ? userStory.description
              : "",
        }))
      );
    }
  }, [data, isLoading, form]);

  useEffect(() => {
    if (useUpdatePlanningPoker.isError) {
      console.log("error");
    }
  }, [useUpdatePlanningPoker.isError]);

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

  const isFormPending = isLoading || useUpdatePlanningPoker.isPending;

  const title = form.watch("title");

  return (
    <div className="pb-10">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col bg-white border rounded-xl"
        >
          <div className="flex justify-between items-center p-8">
            <h1 className="text-gray-900 text-lg">{title}</h1>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                title={intl("actions.delete.buttonTitle")}
                disabled={isFormPending}
              >
                <Trash />
                &nbsp;{intl("actions.delete.buttonLabel")}
              </Button>
              <Button
                variant="outline"
                title={intl("actions.duplicate.buttonTitle")}
                disabled={isFormPending}
              >
                <CopyPlus />
                &nbsp;{intl("actions.duplicate.buttonLabel")}
              </Button>
              <Button
                title={intl("actions.save.buttonTitle")}
                type="submit"
                onSubmit={form.handleSubmit(onSubmit)}
                disabled={isFormPending}
              >
                <ArrowDownToLine />
                &nbsp;{intl("actions.save.buttonLabel")}
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-gray-800 px-1.5 font-mono text-[10px] font-medium">
                  <span className="text-xs">⌘</span>S
                </kbd>
              </Button>
            </div>
          </div>
          <Separator />
          <div className="p-8">
            <h2 className="text-gray-900 font-semibold">
              {intl("form.titles.mainInfo")}
            </h2>
            <div className="grid grid-cols-1 gap-8 mt-4">
              <div className="grid w-full max-w-md items-center gap-1.5">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{intl("form.fields.title.label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={intl("form.fields.title.placeholder")}
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
                      <FormLabel>
                        {intl("form.fields.description.label")}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={intl(
                            "form.fields.description.placeholder"
                          )}
                          {...field}
                          disabled={isFormPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <TagsForm disabled={isFormPending} />
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
