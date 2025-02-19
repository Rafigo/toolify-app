"use client";

import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { PlanningPokerFromApi } from "@/models/planning-poker.model";
import { mapPlanningPokerObject } from "@/services/planning-poker/planning-poker.mapper";
import { getAllPlanningPoker } from "@/services/planning-poker/planning-poker.service";
import PlanningPokerDialogCreate from "../../_components/planning-poker-dialog-create";
import PlanningPokerDialogDelete from "app/planning-poker/_components/planning-poker-dialog-delete";

const DashboardPage = () => {
  const planningPokerMessage = useTranslations("PlanningPoker");

  const { data, error, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ["getAllPlanningPoker"],
    queryFn: getAllPlanningPoker,
  });

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
          <div className="flex gap-2 items-center">
            <Link href={`edition/${planningPoker.id}`} title="Editer">
              <Edit size="18px" />
            </Link>
            <PlanningPokerDialogDelete planningPoker={planningPoker} />
          </div>
        );
      },
    },
  ];

  const reload = () => refetch();

  return (
    <div className="flex flex-col gap-8 bg-white p-8 border rounded-xl">
      <div className="flex justify-between items-center">
        <h1 className="text-gray-900 text-lg font-semibold">
          Mes planning poker
        </h1>
        <div className="flex items-center gap-4">
          <Button
            onClick={reload}
            variant="ghost"
            title="Recharger les données du tableau"
          >
            <RotateCcw />
          </Button>
          <PlanningPokerDialogCreate />
        </div>
      </div>
      <DataTable
        columns={columns}
        data={
          !(isLoading || isRefetching) && data
            ? mapPlanningPokerObject(data)
            : []
        }
        isLoading={isLoading || isRefetching}
      />
      {error && <>Impossible de charger les données</>}
    </div>
  );
};

export default DashboardPage;
