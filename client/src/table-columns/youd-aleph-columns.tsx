import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import StatusBadge from "@/components/app-components/badge-status/badge-status";
import { useBadgeStyle } from "@/hooks/use-badges-styles";

export const YoudAlephColumns = {
  columns: [
    {
      accessorKey: "dateInscription",
      header: ({ column }) => (
        <Button
          variant="link"
          className="p-0 m-0 border-none shadow-none text-inherit hover:no-underline"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date d'inscription
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const rawDate = row.getValue("dateInscription");
        if (!rawDate || typeof rawDate !== "string") return "";
        const date = new Date(rawDate);
        return isNaN(date.getTime()) ? "" : date.toLocaleDateString("fr-FR");
      },
    },
    {
      accessorKey: "firstName",
      header: "Prénom",
    },
    {
      accessorKey: "lastName",
      header: "Nom",
    },
    {
      accessorKey: "statutCandidat",
      header: "Statut du candidat",
      cell: ({ row }) => {
        const status = row.getValue(
          "statutCandidat"
        ) as keyof typeof useBadgeStyle;
        return (
          <div className="min-w-[200px] md:min-w-[180px]">
            <StatusBadge status={status} />
          </div>
        );
      },
    },
    {
      accessorKey: "israeliBacSchool",
      header: "Lycée israélien (Bac)",
    },
    {
      accessorKey: "otherSchoolName",
      header: "Autre établissement scolaire",
    },
    {
      accessorKey: "frenchBacSchoolIsrael",
      header: "Lycée français en Israël (Bac)",
    },
    {
      accessorKey: "mahzorGiyus",
      header: "Mahzor Giyus",
    },
    {
      accessorKey: "expertConnection",
      header: "Connexion Expert",
    },
  ] as ColumnDef<any>[],
};
