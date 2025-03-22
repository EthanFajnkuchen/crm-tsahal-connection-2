import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export const MahzorGiyusColumns = {
  columns: [
    {
      id: "fullName",
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      header: ({ column }) => (
        <Button
          variant="link"
          className="p-0 m-0 border-none shadow-none text-inherit hover:no-underline"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nom complet
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const firstName = row.original.firstName || "";
        const lastName = row.original.lastName || "";
        return `${firstName} ${lastName}`;
      },
      defaultSortDesc: false,
    },
    {
      accessorKey: "email",
      header: "Email",
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
        return isNaN(date.getTime()) ? "-" : date.toLocaleDateString("fr-FR");
      },
      sortingFn: "datetime",
      defaultSortDesc: false,
    },
    {
      accessorKey: "dateFinService",
      header: ({ column }) => (
        <Button
          variant="link"
          className="p-0 m-0 border-none shadow-none text-inherit hover:no-underline"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date de fin de service
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const rawDate = row.getValue("dateFinService");
        if (!rawDate || typeof rawDate !== "string") return "";
        const date = new Date(rawDate);
        return isNaN(date.getTime()) ? "-" : date.toLocaleDateString("fr-FR");
      },
      sortingFn: "datetime",
      defaultSortDesc: false,
    },
    {
      accessorKey: "expertConnection",
      header: "Expert Connection",
    },
  ] as ColumnDef<any>[],
  defaultSorting: [
    { id: "fullName", desc: false },
    { id: "giyusDate", desc: false },
    { id: "dateFinService", desc: false },
  ],
};
