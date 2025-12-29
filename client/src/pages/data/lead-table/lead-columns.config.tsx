import { ColumnDef } from "@tanstack/react-table";
import { Lead } from "@/types/lead";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import StatusBadge from "@/components/app-components/badge-status/badge-status";
import { DeleteLeadAction } from "./delete-lead-action";

export type ColumnKey =
  | "dateInscription"
  | "firstName"
  | "lastName"
  | "email"
  | "phoneNumber"
  | "city"
  | "gender"
  | "ID"
  | "statutCandidat"
  | "actions";

export interface ColumnConfig {
  key: ColumnKey;
  label: string;
  defaultVisible: boolean;
}

export const AVAILABLE_COLUMNS: ColumnConfig[] = [
  { key: "dateInscription", label: "Date d'inscription", defaultVisible: true },
  { key: "firstName", label: "Prénom", defaultVisible: true },
  { key: "lastName", label: "Nom", defaultVisible: true },
  { key: "email", label: "Email", defaultVisible: false },
  { key: "phoneNumber", label: "Téléphone", defaultVisible: false },
  { key: "city", label: "Ville", defaultVisible: false },
  { key: "gender", label: "Genre", defaultVisible: false },
  { key: "ID", label: "ID", defaultVisible: false },
  { key: "statutCandidat", label: "Statut du candidat", defaultVisible: true },
  { key: "actions", label: "Actions", defaultVisible: true },
];

export const createColumnDefinitions = (
  visibleColumns: ColumnKey[],
  onRefresh: () => void
): ColumnDef<Lead>[] => {
  const allColumns: Record<ColumnKey, ColumnDef<Lead>> = {
    dateInscription: {
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
    firstName: {
      accessorKey: "firstName",
      header: "Prénom",
    },
    lastName: {
      accessorKey: "lastName",
      header: "Nom",
    },
    email: {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        const email = row.getValue("email") as string;
        return email || "-";
      },
    },
    phoneNumber: {
      accessorKey: "phoneNumber",
      header: "Téléphone",
      cell: ({ row }) => {
        const phone = row.getValue("phoneNumber") as string;
        return phone || "-";
      },
    },
    city: {
      accessorKey: "city",
      header: "Ville",
      cell: ({ row }) => {
        const city = row.getValue("city") as string;
        return city || "-";
      },
    },
    gender: {
      accessorKey: "gender",
      header: "Genre",
      cell: ({ row }) => {
        const gender = row.getValue("gender") as string;
        return gender || "-";
      },
    },
    ID: {
      accessorKey: "ID",
      header: "ID",
    },
    statutCandidat: {
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
    actions: {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return <DeleteLeadAction lead={row.original} onSuccess={onRefresh} />;
      },
    },
  };

  return visibleColumns.map((key) => allColumns[key]).filter(Boolean);
};
