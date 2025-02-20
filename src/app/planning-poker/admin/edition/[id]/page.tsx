"use client";

import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { ArrowDownToLine, CopyPlus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditionTabMainInfo from "../../../_components/edition-tab-main-info";
import {
  useGetPlanningPokerById,
  useUpdatePlanningPoker,
} from "app/planning-poker/_hooks/planning-poker.hook";
import { updatePlanningPokerSchema } from "app/planning-poker/_libs/planning-poker";
import { useToast } from "@/hooks/use-toast";
import { PlanningPokerForm } from "@/models/planning-poker.model";
import UserStoriesTab from "../../../_components/edition-tab-user-stories";
import { Separator } from "@/components/ui/separator";

const EditionPage = () => {
  const { toast } = useToast();
  const { data, isLoading } = useGetPlanningPokerById();
  const { mutate: updatePlanningPoker } = useUpdatePlanningPoker();

  const form = useForm<z.infer<typeof updatePlanningPokerSchema>>({
    resolver: zodResolver(updatePlanningPokerSchema),
  });

  const onSubmit = async (data: PlanningPokerForm) => {
    try {
      await updatePlanningPoker(data);
      toast({
        title: "Success",
        description: "Planning poker updated successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update planning poker",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data, form]);

  return (
    <div className="flex flex-col gap-4 bg-white p-8 rounded-xl border">
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-xs">Mon planning poker</span>
              <h1 className="text-gray-900 text-lg font-semibold">
                {data?.title}
              </h1>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                title={useTranslations("PlanningPoker.Edition")(
                  "actions.delete.buttonTitle"
                )}
                disabled={isLoading}
              >
                <Trash />
                &nbsp;
                {useTranslations("PlanningPoker.Edition")(
                  "actions.delete.buttonLabel"
                )}
              </Button>
              <Button
                variant="outline"
                title={useTranslations("PlanningPoker.Edition")(
                  "actions.duplicate.buttonTitle"
                )}
                disabled={isLoading}
              >
                <CopyPlus />
                &nbsp;
                {useTranslations("PlanningPoker.Edition")(
                  "actions.duplicate.buttonLabel"
                )}
              </Button>
              <Button
                title={useTranslations("PlanningPoker.Edition")(
                  "actions.save.buttonTitle"
                )}
                type="submit"
                disabled={isLoading}
              >
                <ArrowDownToLine />
                &nbsp;
                {useTranslations("PlanningPoker.Edition")(
                  "actions.save.buttonLabel"
                )}
              </Button>
            </div>
          </div>
          <Separator />
          <Tabs defaultValue="mainInfo" className="">
            <TabsList>
              <TabsTrigger value="mainInfo">Informations générales</TabsTrigger>
              <TabsTrigger value="userStories">User stories</TabsTrigger>
            </TabsList>

            <TabsContent value="mainInfo">
              <div className="px-4">
                <EditionTabMainInfo />
              </div>
            </TabsContent>
            <TabsContent value="userStories">
              <div className="px-4">
                <UserStoriesTab disabled={false} />
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </FormProvider>
    </div>
  );
};

export default EditionPage;
