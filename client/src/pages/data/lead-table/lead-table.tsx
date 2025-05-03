import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowUpDown, Download, Loader2 } from "lucide-react";

import { DataTable } from "@/components/app-components/table/table";
import StatusBadge from "@/components/app-components/badge-status/badge-status";
import Section from "@/components/app-components/section/section";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { Lead } from "@/types/lead";

import { RootState, AppDispatch } from "@/store/store";
import { fetchAllLeadsThunk } from "@/store/thunks/data/all-leads.thunk";
import { searchLeadsThunk } from "@/store/thunks/data/search-leads.thunk";
import { downloadLeadsThunk } from "@/store/thunks/data/excel.thunk";

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
      const date = row.getValue("dateInscription") as string;
      return new Date(date).toLocaleDateString("fr-FR");
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
      const status = row.getValue("statutCandidat") as string;
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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");

  const [isDownloading, setIsDownloading] = useState(false);

  const { data, isLoading, error } = useSelector((state: RootState) =>
    searchQuery ? state.searchLeads : state.allLeads
  );

  useEffect(() => {
    if (searchQuery) {
      dispatch(searchLeadsThunk(searchQuery));
    } else {
      dispatch(fetchAllLeadsThunk());
    }
  }, [dispatch, searchQuery]);

  console.log({ data });

  const handleDownloadExcel = async () => {
    try {
      setIsDownloading(true);
      const result = await dispatch(downloadLeadsThunk()).unwrap();

      const url = window.URL.createObjectURL(result);
      const a = document.createElement("a");
      a.href = url;
      a.download = "leads.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erreur lors du téléchargement du fichier :", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Section
      title="Liste des leads"
      onAction={handleDownloadExcel}
      actionLoading={isDownloading}
      actionButtonClassName="bg-[#3daa58] hover:bg-green-700 rounded-md"
      actionButtonContent={
        isDownloading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Télécharger Excel
          </div>
        )
      }
    >
      <DataTable
        columns={columns}
        data={data || []}
        isLoading={isLoading}
        error={error}
        onRowClick={(row) => navigate(`/lead-details/${(row as any).ID}`)}
      />
    </Section>
  );
}
