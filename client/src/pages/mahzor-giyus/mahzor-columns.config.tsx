import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Lead } from "@/types/lead";

export type MahzorColumnKey =
  | "fullName"
  | "email"
  | "phoneNumber"
  | "giyusDate"
  | "currentStatus"
  | "statutCandidat"
  | "mahzorGiyus"
  | "typeGiyus"
  | "pikoud"
  | "city";

export interface AvailableColumn {
  key: MahzorColumnKey;
  label: string;
  defaultVisible: boolean;
}

export const AVAILABLE_MAHZOR_COLUMNS: AvailableColumn[] = [
  { key: "fullName", label: "Nom complet", defaultVisible: true },
  { key: "email", label: "Email", defaultVisible: true },
  { key: "phoneNumber", label: "Téléphone", defaultVisible: true },
  { key: "giyusDate", label: "Date de Giyus", defaultVisible: true },
  { key: "currentStatus", label: "Statut actuel", defaultVisible: true },
  { key: "statutCandidat", label: "Statut candidat", defaultVisible: false },
  { key: "mahzorGiyus", label: "Mahzor Giyus", defaultVisible: false },
  { key: "typeGiyus", label: "Type Giyus", defaultVisible: false },
  { key: "pikoud", label: "Pikoud", defaultVisible: false },
  { key: "city", label: "Ville", defaultVisible: false },
];

export const createMahzorColumnDefinitions = (
  visibleColumns: MahzorColumnKey[]
): ColumnDef<Lead>[] => {
  const allColumns: Record<MahzorColumnKey, ColumnDef<Lead>> = {
    fullName: {
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
    },
    email: {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => row.original.email || "-",
    },
    phoneNumber: {
      accessorKey: "phoneNumber",
      header: "Téléphone",
      cell: ({ row }) => row.original.phoneNumber || "-",
    },
    giyusDate: {
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
        if (!rawDate || typeof rawDate !== "string") return "-";
        const date = new Date(rawDate);
        return isNaN(date.getTime()) ? "-" : date.toLocaleDateString("fr-FR");
      },
      sortingFn: "datetime",
    },
    currentStatus: {
      accessorKey: "currentStatus",
      header: "Statut actuel",
      cell: ({ row }) => row.original.currentStatus || "-",
    },
    statutCandidat: {
      accessorKey: "statutCandidat",
      header: "Statut candidat",
      cell: ({ row }) => row.original.statutCandidat || "-",
    },
    mahzorGiyus: {
      accessorKey: "mahzorGiyus",
      header: "Mahzor Giyus",
      cell: ({ row }) => row.original.mahzorGiyus || "-",
    },
    typeGiyus: {
      accessorKey: "typeGiyus",
      header: "Type Giyus",
      cell: ({ row }) => row.original.typeGiyus || "-",
    },
    pikoud: {
      accessorKey: "pikoud",
      header: "Pikoud",
      cell: ({ row }) => row.original.pikoud || "-",
    },
    city: {
      accessorKey: "city",
      header: "Ville",
      cell: ({ row }) => row.original.city || "-",
    },
  };

  return visibleColumns
    .map((key) => allColumns[key])
    .filter((col): col is ColumnDef<Lead> => col !== undefined);
};
