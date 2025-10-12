import { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
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

import { AppDispatch } from "@/store/store";
import { getActivitiesThunk } from "@/store/thunks/activity/activity.thunk";
import { getActiviteMassaThunk } from "@/store/thunks/activite-massa/activite-massa.thunk";
import { ActivityActions } from "./activity-actions";
import { ActivityMassaActions } from "./activity-massa-actions";
import { AddActiviteMassaDialog } from "@/components/app-components/add-activite-massa-dialog";
import { ActiviteMassa } from "@/store/adapters/activite-massa/activite-massa.adapter";

// Type combiné pour les activités
type CombinedActivity =
  | Activity
  | (ActiviteMassa & {
      name: string;
      category: string;
      type: "massa";
    });

export function ActivityTable() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [combinedActivities, setCombinedActivities] = useState<
    CombinedActivity[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const categoryFilter =
        selectedCategory === "all" ? undefined : selectedCategory;

      // Faire les deux appels en parallèle
      const [activitiesResult, massaResult] = await Promise.allSettled([
        dispatch(getActivitiesThunk(categoryFilter)).unwrap(),
        dispatch(getActiviteMassaThunk({})).unwrap(),
      ]);

      let combined: CombinedActivity[] = [];

      // Ajouter les activités normales (Salon/Conférence)
      if (activitiesResult.status === "fulfilled") {
        const salonActivities = activitiesResult.value.filter(
          (activity) => activity.category === "Salon/Conférence"
        );
        combined = [...salonActivities];
      }

      // Ajouter les activités Massa avec nom formaté
      if (massaResult.status === "fulfilled") {
        const massaActivities: CombinedActivity[] = massaResult.value.map(
          (massa) => {
            // Trouver l'activité type correspondante dans les activités récupérées
            const activityType =
              activitiesResult.status === "fulfilled"
                ? activitiesResult.value.find(
                    (activity) => activity.id === massa.id_activite_type
                  )
                : null;
            const activityName = activityType
              ? activityType.name
              : `Activité ${massa.id_activite_type}`;

            return {
              ...massa,
              name: `${activityName} - ${massa.programName} - ${massa.programYear}`,
              category: "Massa/Écoles",
              type: "massa" as const,
            };
          }
        );
        combined = [...combined, ...massaActivities];
      }

      // Filtrer par catégorie si nécessaire
      if (selectedCategory !== "all") {
        combined = combined.filter(
          (activity) => activity.category === selectedCategory
        );
      }

      setCombinedActivities(combined);

      // Gérer les erreurs
      if (
        activitiesResult.status === "rejected" &&
        massaResult.status === "rejected"
      ) {
        setError("Erreur lors du chargement des activités");
      } else if (activitiesResult.status === "rejected") {
        setError("Erreur lors du chargement des activités Salon/Conférence");
      } else if (massaResult.status === "rejected") {
        setError("Erreur lors du chargement des activités Massa/Écoles");
      }
    } catch (err) {
      setError("Erreur lors du chargement des données");
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, selectedCategory]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const columns: ColumnDef<CombinedActivity>[] = [
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
        // If date is empty or before year 2000, display empty string
        if (!date || date.trim() === "") {
          return "";
        }
        const dateObj = new Date(date);
        if (dateObj.getFullYear() < 2000) {
          return "";
        }
        return dateObj.toLocaleDateString("fr-FR");
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
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const activity = row.original;
        // Vérifier si c'est une activité Massa/École
        if ("type" in activity && activity.type === "massa") {
          return (
            <ActivityMassaActions activity={activity} onSuccess={refreshData} />
          );
        }
        // Sinon, utiliser les actions normales
        return <ActivityActions activity={activity} />;
      },
    },
  ];

  const handleRowClick = (activity: CombinedActivity) => {
    const activityType =
      "type" in activity && activity.type === "massa" ? "massa" : "salon";

    // Utiliser les routes spécifiques selon le type d'activité
    if (activityType === "massa") {
      navigate(`/activites/massa/${activity.id}`, {
        state: {
          activityName: activity.name,
          activityType: activityType,
        },
      });
    } else {
      navigate(`/activites/salon/${activity.id}`, {
        state: {
          activityName: activity.name,
          activityType: activityType,
        },
      });
    }
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
        {/* Header with Add Button and Category Filter */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <label htmlFor="category-filter" className="text-sm font-medium">
              Filtrer par catégorie :
            </label>
            <Select
              value={selectedCategory}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                <SelectItem value="Salon/Conférence">
                  Salon/Conférence
                </SelectItem>
                <SelectItem value="Massa/Écoles">Massa/Écoles</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <AddActiviteMassaDialog onSuccess={refreshData} />
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={combinedActivities}
          isLoading={isLoading}
          onRowDoubleClick={handleRowClick}
          // searchKey="name"
          // searchPlaceholder="Rechercher par nom d'activité..."
        />
      </div>
    </Section>
  );
}
