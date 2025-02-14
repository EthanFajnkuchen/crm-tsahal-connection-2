import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/app-components/table/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import StatusBadge from "@/components/app-components/badge-status/badge-status";
import { useBadgeStyle } from "@/hooks/use-badges-styles";

// This type defines the shape of our data.
type Lead = {
  id: string;
  dateInscription: Date;
  prenom: string;
  nom: string;
  status:
    | "À traiter"
    | "En cours de traitement"
    | "Dossier traité"
    | "Ne répond pas/Ne sait pas"
    | "Pas de notre ressort";
};

const columns: ColumnDef<Lead>[] = [
  {
    accessorKey: "dateInscription",
    header: ({ column }) => {
      return (
        <Button
          variant="link"
          className="p-0 m-0 border-none shadow-none text-inherit hover:no-underline"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date d'inscription
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("dateInscription") as Date;
      const formatted = date.toLocaleDateString("fr-FR");
      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "prenom",
    header: "Prénom",
  },
  {
    accessorKey: "nom",
    header: "Nom",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as keyof typeof useBadgeStyle;
      return (
        <div className="min-w-[200px] md:min-w-[180px]">
          <StatusBadge status={status} />
        </div>
      );
    },
  },
];

const data: Lead[] = [
  {
    id: "728ed52f",
    dateInscription: new Date("2023-01-15"),
    prenom: "Marie",
    nom: "Dubois",
    status: "À traiter",
  },
  {
    id: "489e1d42",
    dateInscription: new Date("2023-02-28"),
    prenom: "Jean",
    nom: "Martin",
    status: "En cours de traitement",
  },
  {
    id: "573c1b9a",
    dateInscription: new Date("2023-03-10"),
    prenom: "Sophie",
    nom: "Lefebvre",
    status: "Dossier traité",
  },
  {
    id: "692f4e3d",
    dateInscription: new Date("2023-04-05"),
    prenom: "Pierre",
    nom: "Moreau",
    status: "Ne répond pas/Ne sait pas",
  },
  {
    id: "815a7c2b",
    dateInscription: new Date("2023-05-20"),
    prenom: "Isabelle",
    nom: "Girard",
    status: "Pas de notre ressort",
  },
  {
    id: "815a7c2b",
    dateInscription: new Date("2023-05-20"),
    prenom: "Isabelle",
    nom: "Girard",
    status: "Pas de notre ressort",
  },
  {
    id: "815a7c2b",
    dateInscription: new Date("2023-05-20"),
    prenom: "Isabelle",
    nom: "Girard",
    status: "Pas de notre ressort",
  },
  {
    id: "815a7c2b",
    dateInscription: new Date("2023-05-20"),
    prenom: "Isabelle",
    nom: "Girard",
    status: "Pas de notre ressort",
  },
  {
    id: "815a7c2b",
    dateInscription: new Date("2023-05-20"),
    prenom: "Isabelle",
    nom: "Girard",
    status: "Pas de notre ressort",
  },
  {
    id: "815a7c2b",
    dateInscription: new Date("2023-05-20"),
    prenom: "Isabelle",
    nom: "Girard",
    status: "Pas de notre ressort",
  },
];

export function LastTenLeadTable() {
  return (
    <div className="">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
