import { DataTable } from "@/components/app-components/table/table";
import StatusBadge from "@/components/app-components/badge-status/badge-status";
import type { ColumnDef } from "@tanstack/react-table";
import Section from "@/components/app-components/section/section";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { RootState, AppDispatch } from "@/store/store";
import { fetchAllLeadsThunk } from "@/store/thunks/data/all-leads.thunk";

type Lead = {
  id: string;
  inscriptionDate: string;
  fullName: string;
  status: string;
};

const columns: ColumnDef<Lead>[] = [
  {
    accessorKey: "inscriptionDate",
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
      const date = row.getValue("inscriptionDate") as string;
      return new Date(date).toLocaleDateString("fr-FR");
    },
  },
  {
    accessorKey: "fullName",
    header: "Nom complet",
  },
  {
    accessorKey: "status",
    header: "Statut du candidat",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div className="min-w-[200px] md:min-w-[180px]">
          <StatusBadge status={status} />
        </div>
      );
    },
  },
];

export function LeadTable() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, isLoading, error } = useSelector(
    (state: RootState) => state.allLeads
  );

  useEffect(() => {
    dispatch(fetchAllLeadsThunk());
  }, [dispatch]);

  const formattedData: Lead[] =
    data?.map((lead) => ({
      id: lead.id,
      inscriptionDate: lead.dateInscription,
      fullName: `${lead.firstName} ${lead.lastName}`,
      status: lead.statutCandidat,
    })) || [];

  return (
    <Section title={"Liste des leads"}>
      <DataTable
        columns={columns}
        data={formattedData}
        isLoading={isLoading}
        error={error}
      />
    </Section>
  );
}
