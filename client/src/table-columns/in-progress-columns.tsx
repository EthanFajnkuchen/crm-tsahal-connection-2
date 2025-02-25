import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export const inProgressColumns = {
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
        const date = new Date(row.getValue("dateInscription"));
        return date.toLocaleDateString("fr-FR");
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
      accessorKey: "giyusDate",
      header: ({ column }) => (
        <Button
          variant="link"
          className="p-0 m-0 border-none shadow-none text-inherit hover:no-underline"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date de Giyus
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const rawDate = row.getValue("giyusDate");

        if (!rawDate || typeof rawDate !== "string") return "";

        const date = new Date(rawDate);

        return isNaN(date.getTime()) ? "" : date.toLocaleDateString("fr-FR");
      },
    },
    {
      accessorKey: "programName",
      header: "Nom du Programme",
    },
    {
      accessorKey: "schoolYears",
      header: "Années Scolaires",
    },
  ] as ColumnDef<any>[],
};
