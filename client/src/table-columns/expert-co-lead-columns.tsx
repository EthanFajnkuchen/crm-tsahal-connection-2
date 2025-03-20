import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export const expertConnectionColumns = {
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
        return isNaN(date.getTime()) ? "-" : date.toLocaleDateString("fr-FR");
      },
      sortingFn: "datetime",
      defaultSortDesc: false, // Tri par défaut en ordre ascendant (ASC)
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
      accessorKey: "produitEC1",
      header: "Produit EC 1",
    },
    {
      accessorKey: "produitEC2",
      header: "Produit EC 2",
    },
    {
      accessorKey: "produitEC3",
      header: "Produit EC 3",
    },
    {
      accessorKey: "produitEC4",
      header: "Produit EC 4",
    },
    {
      accessorKey: "produitEC5",
      header: "Produit EC 5",
    },
  ] as ColumnDef<any>[],
  defaultSorting: [{ id: "dateInscription", desc: false }],
};
