"use client";

import AppHeader from "@/components/app-header/app-header.component";
import { AppJumbotron } from "@/components/app-jumbotron/app-jumbotron.components";
import { Button } from "@/components/ui/button";
import { cn } from "@/libs/utils";
import { Book, ChevronRight, Cog, Spade } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ReactElement } from "react";

interface Tool {
  id: string;
  name: string;
  description: string;
  link: string;
  icon: ReactElement;
}

export default function RootPage() {
  const t = useTranslations("HomePage");

  const tools: Tool[] = [
    {
      id: "planning-poker",
      name: t("links.planningPoker.title"),
      description:
        "Créer vos planning poker en toute simplicité, lancez des sessions à la demande",
      link: "/planning-poker",
      icon: <Spade />,
    },
    {
      id: "documentation",
      name: "Documentation",
      description:
        "Rédiger la documentation fonctionnelle et technique de votre projet",
      link: "/planning-poker",
      icon: <Book />,
    },
    {
      id: "mocks",
      name: "Mocks",
      description: "Définissez et partagez vos mocks",
      link: "/planning-poker",
      icon: <Cog />,
    },
  ];

  return (
    <div className="h-screen text-gray-800">
      <AppHeader />
      <div className="mx-auto max-w-screen-lg p-10">
        <div className="h-60 mb-10 relative w-full overflow-hidden bg-gray-800 flex flex-col items-center justify-center rounded-3xl">
          <div className="absolute inset-0 w-full h-full bg-gray-800 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />

          <AppJumbotron />
          <h1 className={cn("md:text-4xl text-xl text-white relative z-20")}>
            {t("jumbotron.title")} is Awesome
          </h1>
          <p className="text-center mt-2 text-neutral-300 relative z-20">
            {t("jumbotron.description")}
          </p>
        </div>
        <h2 className="text-xl font-semibold mb-4">Parcourir mes outils</h2>
        <div className="grid gap-4 grid-cols-1">
          {tools.map((tool) => (
            <div
              className="flex justify-between border p-6 rounded-2xl"
              key={`key-tool-${tool.id}`}
            >
              <div className="flex gap-4">
                {tool.icon}
                <div className="flex flex-col gap-2">
                  <h4 className="font-semibold m-0 p-0">{tool.name}</h4>
                  <p className="text-sm text-gray-700">{tool.description}</p>
                </div>
              </div>
              <Link href={tool.link}>
                <Button>
                  <ChevronRight />
                  {t("links.accessLink")}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
