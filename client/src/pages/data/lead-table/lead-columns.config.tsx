import { ColumnDef } from "@tanstack/react-table";
import { Lead } from "@/types/lead";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import StatusBadge from "@/components/app-components/badge-status/badge-status";
import { DeleteLeadAction } from "./delete-lead-action";
import { JUDAISM } from "@/i18n/judaism";
import { TYPE_GIYUS } from "@/i18n/type-giyus";
import { TYPE_POSTE } from "@/i18n/type-poste";
import { PIKOUD } from "@/i18n/pikoud";
import { EDUCATION } from "@/i18n/education";
import { MILITARY } from "@/i18n/military";

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
  | "currentStatus"
  | "whatsappNumber"
  | "mahzorGiyus"
  | "giyusDate"
  | "StatutLoiRetour"
  | "typeGiyus"
  | "typePoste"
  | "nomPoste"
  | "pikoud"
  | "dateFinService"
  | "birthDate"
  | "expertConnection"
  | "passportNumber1"
  | "bacObtention"
  | "soldierAloneStatus"
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
  { key: "whatsappNumber", label: "WhatsApp", defaultVisible: false },
  { key: "city", label: "Ville", defaultVisible: false },
  { key: "gender", label: "Genre", defaultVisible: false },
  { key: "birthDate", label: "Date de naissance", defaultVisible: false },
  { key: "ID", label: "ID", defaultVisible: false },
  { key: "statutCandidat", label: "Statut du candidat", defaultVisible: true },
  { key: "currentStatus", label: "Situation actuelle", defaultVisible: false },
  { key: "mahzorGiyus", label: "Mahzor Giyus", defaultVisible: false },
  { key: "giyusDate", label: "Date de Giyus", defaultVisible: false },
  { key: "typeGiyus", label: "Type Giyus", defaultVisible: false },
  {
    key: "StatutLoiRetour",
    label: "Statut Loi du Retour",
    defaultVisible: false,
  },
  { key: "typePoste", label: "Type de poste", defaultVisible: false },
  { key: "nomPoste", label: "Nom du poste", defaultVisible: false },
  { key: "pikoud", label: "Pikoud", defaultVisible: false },
  {
    key: "dateFinService",
    label: "Date de fin de service",
    defaultVisible: false,
  },
  {
    key: "expertConnection",
    label: "Expert Connection",
    defaultVisible: false,
  },
  {
    key: "passportNumber1",
    label: "Numéro de passeport",
    defaultVisible: false,
  },
  { key: "bacObtention", label: "Obtention du Bac", defaultVisible: false },
  { key: "soldierAloneStatus", label: "Soldat seul", defaultVisible: false },
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
    currentStatus: {
      accessorKey: "currentStatus",
      header: "Situation actuelle",
      cell: ({ row }) => {
        const status = row.getValue("currentStatus") as string;
        return status || "-";
      },
    },
    whatsappNumber: {
      accessorKey: "whatsappNumber",
      header: "WhatsApp",
      cell: ({ row }) => {
        const whatsapp = row.getValue("whatsappNumber") as string;
        return whatsapp || "-";
      },
    },
    mahzorGiyus: {
      accessorKey: "mahzorGiyus",
      header: "Mahzor Giyus",
      cell: ({ row }) => {
        const mahzor = row.getValue("mahzorGiyus") as string;
        return mahzor || "-";
      },
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
        const date = row.getValue("giyusDate") as string;
        if (!date) return "-";
        return new Date(date).toLocaleDateString("fr-FR");
      },
    },
    StatutLoiRetour: {
      accessorKey: "StatutLoiRetour",
      header: "Statut Loi du Retour",
      cell: ({ row }) => {
        const value = row.getValue("StatutLoiRetour") as string;
        const option = JUDAISM.status_return_law.find(
          (opt) => opt.value === value
        );
        return option?.displayName || value || "-";
      },
    },
    typeGiyus: {
      accessorKey: "typeGiyus",
      header: "Type Giyus",
      cell: ({ row }) => {
        const value = row.getValue("typeGiyus") as string;
        const option = TYPE_GIYUS.find((opt) => opt.value === value);
        return option?.displayName || value || "-";
      },
    },
    typePoste: {
      accessorKey: "typePoste",
      header: "Type de poste",
      cell: ({ row }) => {
        const value = row.getValue("typePoste") as string;
        const option = TYPE_POSTE.find((opt) => opt.value === value);
        return option?.displayName || value || "-";
      },
    },
    nomPoste: {
      accessorKey: "nomPoste",
      header: "Nom du poste",
      cell: ({ row }) => {
        const nom = row.getValue("nomPoste") as string;
        return nom || "-";
      },
    },
    pikoud: {
      accessorKey: "pikoud",
      header: "Pikoud",
      cell: ({ row }) => {
        const value = row.getValue("pikoud") as string;
        const option = PIKOUD.find((opt) => opt.value === value);
        return option?.displayName || value || "-";
      },
    },
    dateFinService: {
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
        const date = row.getValue("dateFinService") as string;
        if (!date) return "-";
        return new Date(date).toLocaleDateString("fr-FR");
      },
    },
    birthDate: {
      accessorKey: "birthDate",
      header: ({ column }) => (
        <Button
          variant="link"
          className="p-0 m-0 border-none shadow-none text-inherit hover:no-underline"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date de naissance
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = row.getValue("birthDate") as string;
        if (!date) return "-";
        return new Date(date).toLocaleDateString("fr-FR");
      },
    },
    expertConnection: {
      accessorKey: "expertConnection",
      header: "Expert Connection",
      cell: ({ row }) => {
        const value = row.getValue("expertConnection") as string;
        if (value === "Oui") return "Oui";
        if (value === "Non") return "Non";
        return "-";
      },
    },
    passportNumber1: {
      accessorKey: "passportNumber1",
      header: "Numéro de passeport",
      cell: ({ row }) => {
        const passport = row.getValue("passportNumber1") as string;
        return passport || "-";
      },
    },
    bacObtention: {
      accessorKey: "bacObtention",
      header: "Obtention du Bac",
      cell: ({ row }) => {
        const value = row.getValue("bacObtention") as string;
        const option = EDUCATION.has_bac.find((opt) => opt.value === value);
        return option?.displayName || value || "-";
      },
    },
    soldierAloneStatus: {
      accessorKey: "soldierAloneStatus",
      header: "Soldat seul",
      cell: ({ row }) => {
        const value = row.getValue("soldierAloneStatus") as string;
        const option = MILITARY.is_lone_solider.find(
          (opt) => opt.value === value
        );
        return option?.displayName || value || "-";
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
