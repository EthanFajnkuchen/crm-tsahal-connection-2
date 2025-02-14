import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/app-components/table/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import StatusBadge from "@/components/app-components/badge-status/badge-status";
import { useBadgeStyle } from "@/hooks/use-badges-styles";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Progress } from "@/components/ui/progress";

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

export function LastTenLeadTable() {
  const { lastTenLeads, isLoading, error } = useSelector(
    (state: RootState) => state.dashboard
  );

  if (isLoading) {
    return <Progress value={50} className="w-full" />;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  const transformedData: Lead[] =
    lastTenLeads?.map((lead, index) => ({
      id: `${index}-${lead.email}`,
      dateInscription: new Date(lead.dateInscription),
      prenom: lead.firstName,
      nom: lead.lastName,
      status: lead.statutCandidat as Lead["status"],
    })) || [];

  return (
    <div className="">
      <DataTable columns={columns} data={transformedData} />
    </div>
  );
}
