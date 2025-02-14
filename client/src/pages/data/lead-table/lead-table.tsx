import { DataTable } from "@/components/app-components/table/table";
import StatusBadge from "@/components/app-components/badge-status/badge-status";
import type { ColumnDef } from "@tanstack/react-table";
import Section from "@/components/app-components/section/section";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

// Define the type for our data
type Candidate = {
  id: string;
  inscriptionDate: Date;
  fullName: string;
  status: string;
};

// Define our columns
const columns: ColumnDef<Candidate>[] = [
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
      const date = row.getValue("inscriptionDate") as Date;
      return date.toLocaleDateString("fr-FR");
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

// Generate a large amount of sample data
const generateData = (count: number): Candidate[] => {
  const statuses = ["En cours de traitement", "À traiter", "Dossier traité"];
  return Array.from({ length: count }, (_, i) => ({
    id: (i + 1).toString(),
    inscriptionDate: new Date(
      2023,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    ),
    fullName: `Candidate ${i + 1}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
  }));
};

const data: Candidate[] = generateData(1000);
export function LeadTable() {
  return (
    <Section title={"Liste des leads"}>
      <DataTable columns={columns} data={data} />
    </Section>
  );
}
