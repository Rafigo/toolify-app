"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useTranslations } from "next-intl";
import TagsForm from "app/planning-poker/_components/tags-management";
import { useFormContext } from "react-hook-form";

const EditionTabMainInfo = () => {
  const intl = useTranslations("PlanningPoker.Edition");
  const { control } = useFormContext();

  return (
    <div className="flex flex-col gap-4">
      <div className="grid w-full max-w-md items-center gap-1.5">
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{intl("form.fields.title.label")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={intl("form.fields.title.placeholder")}
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
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{intl("form.fields.description.label")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={intl("form.fields.description.placeholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <TagsForm />
    </div>
  );
};

export default EditionTabMainInfo;
