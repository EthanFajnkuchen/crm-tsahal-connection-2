import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowUpDown } from "lucide-react";

import { DataTable } from "@/components/app-components/table/table";
import Section from "@/components/app-components/section/section";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ColumnDef } from "@tanstack/react-table";
import { Activity } from "@/store/adapters/activity/activity.adapter";

import { RootState, AppDispatch } from "@/store/store";
import { getActivitiesThunk } from "@/store/thunks/activity/activity.thunk";

const columns: ColumnDef<Activity>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="link"
        className="p-0 m-0 border-none shadow-none text-inherit hover:no-underline"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Nom de l'activité
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return <div className="font-medium">{name}</div>;
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button
        variant="link"
        className="p-0 m-0 border-none shadow-none text-inherit hover:no-underline"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.getValue("date") as string;
      return new Date(date).toLocaleDateString("fr-FR");
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <Button
        variant="link"
        className="p-0 m-0 border-none shadow-none text-inherit hover:no-underline"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Catégorie
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const category = row.getValue("category") as string;
      return (
        <div className="flex items-center">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
            {category}
          </span>
        </div>
      );
    },
  },
];

export function ActivityTable() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { activities, isLoading, error } = useSelector(
    (state: RootState) => state.activity
  );

  useEffect(() => {
    // Fetch activities with optional category filter
    const categoryFilter =
      selectedCategory === "all" ? undefined : selectedCategory;
    dispatch(getActivitiesThunk(categoryFilter));
  }, [dispatch, selectedCategory]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handleRowClick = (activity: Activity) => {
    navigate(`/activites/${activity.id}`, {
      state: { activityName: activity.name },
    });
  };

  if (error) {
    return (
      <Section title="Liste des activités">
        <div className="p-4 text-center text-red-500">
          Erreur lors du chargement des activités: {error}
        </div>
      </Section>
    );
  }

  return (
    <Section title="Liste des activités">
      <div className="space-y-4">
        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="category-filter" className="text-sm font-medium">
            Filtrer par catégorie :
          </label>
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              <SelectItem value="Salon/Conférence">Salon/Conférence</SelectItem>
              <SelectItem value="Massa/Ecole">Massa/Ecole</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={activities}
          isLoading={isLoading}
          onRowClick={handleRowClick}
          // searchKey="name"
          // searchPlaceholder="Rechercher par nom d'activité..."
        />
      </div>
    </Section>
  );
}
