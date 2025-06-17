import { useEffect } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "@/store/store";
import { fetchLastTenLeadsThunk } from "@/store/thunks/dashboard/last-ten-leads.thunk";
import { Lead } from "@/types/lead";

import { DataTable } from "@/components/app-components/table/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import StatusBadge from "@/components/app-components/badge-status/badge-status";
import { useBadgeStyle } from "@/hooks/use-badges-styles";

const columns: ColumnDef<Lead, unknown>[] = [
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
      const formatted = date.toLocaleDateString("fr-FR");
      return <div>{formatted}</div>;
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
    header: "Status",
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
];

export function LastTenLeadTable() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    data: lastTenLeads,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.lastTenLeads);

  useEffect(() => {
    dispatch(fetchLastTenLeadsThunk());
  }, [dispatch]);

  const handleRowClick = (lead: any) => {
    if (lead.ID) {
      navigate(`/lead-details/${lead.ID}`);
    }
  };

  return (
    <div className="">
      <DataTable
        columns={columns}
        data={lastTenLeads || []}
        isLoading={isLoading}
        error={error}
        onRowClick={handleRowClick}
      />
    </div>
  );
}
