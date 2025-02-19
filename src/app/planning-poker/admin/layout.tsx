"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import AppHeader from "@/components/app-header/app-header.component";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { useTranslations } from "next-intl";
import { getPlanningPokerRouteBySegment } from "../_libs/route";

interface BreadcrumbProps {
  id: string;
  path: string;
  label: string;
}

export default function PlanningPokerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const intl = useTranslations("PlanningPoker");
  const pathname = usePathname();
  const pathNames: BreadcrumbProps[] = pathname
    .split("/")
    .filter((path) => ["planning-poker", "admin", "edition"].includes(path))
    .map((path) => ({
      id: path,
      path: getPlanningPokerRouteBySegment(path),
      label: intl(`breadcrumb.${path}`),
    }));

  return (
    <div className="h-screen">
      <AppHeader />
      <div className="h-screen max-w-screen-lg mx-auto p-4">
        <div className="flex gap-4 items-center mb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="bg-gray-200 p-2 rounded-lg text-primary font-semibold">
                <BreadcrumbLink href="/">Toolify</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              {pathNames.map((path, index) => (
                <Fragment key={`key-path-${path.id}`}>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={path.path}>
                      {path.label}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {pathNames.length !== index + 1 && <BreadcrumbSeparator />}
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        {children}
      </div>
    </div>
  );
}
