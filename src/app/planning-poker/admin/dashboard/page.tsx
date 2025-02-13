"use client";

import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { PlanningPokerFromApi } from "@/models/planning-poker.model";
import { mapPlanningPokerObject } from "@/services/planning-poker/planning-poker.mapper";
import { getAllPlanningPoker } from "@/services/planning-poker/planning-poker.service";
import PlanningPokerDialogCreate from "../../_components/planning-poker-dialog-create";

const DashboardPage = () => {
  const planningPokerMessage = useTranslations("PlanningPoker");
  const columns: ColumnDef<PlanningPokerFromApi>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {planningPokerMessage("AdminPage.table.columns.title")}
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("title")}</div>,
    },
    {
      accessorKey: "status",
      header: planningPokerMessage("AdminPage.table.columns.status"),
      cell: ({ row }) => (
        <div>
          {planningPokerMessage(
            `planningPokerValues.status.${row.getValue("status")}`
          )}
        </div>
      ),
    },
    {
      id: "link",
      header: planningPokerMessage("AdminPage.table.columns.action"),
      cell: ({ row }) => {
        const planningPoker = row.original;

        return (
          <>
            <Link href={`edit/${planningPoker.sessionUrl}`}>
              <Edit size="20px" />
            </Link>
          </>
        );
      },
    },
  ];

  const { data, error, isLoading } = useQuery({
    queryKey: ["getAllPlanningPoker"],
    queryFn: getAllPlanningPoker,
  });

  return (
    <div className="flex flex-col gap-8 bg-white p-8 border rounded-xl">
      <div className="flex justify-between items-center">
        <h1 className="text-gray-900 text-lg font-semibold">
          Mes planning poker
        </h1>
        <PlanningPokerDialogCreate />
      </div>
      {isLoading && <>Chargement en cours, merci de patienter...</>}
      {error && <>Impossible de charger les données</>}
      {data && (
        <DataTable columns={columns} data={mapPlanningPokerObject(data)} />
      )}
    </div>
  );
};

export default DashboardPage;
