import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowUpDown, Edit, Trash2 } from "lucide-react";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ColumnDef } from "@tanstack/react-table";
import { Activity } from "@/store/adapters/activity/activity.adapter";

import { RootState, AppDispatch } from "@/store/store";
import {
  getActivitiesThunk,
  updateActivityThunk,
  deleteActivityThunk,
} from "@/store/thunks/activity/activity.thunk";
import { useUserPermissions } from "@/hooks/use-user-permissions";
import { RoleType } from "@/types/role-types";

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
      return <ActivityActions activity={activity} />;
    },
  },
];

interface ActivityActionsProps {
  activity: Activity;
}

function ActivityActions({ activity }: ActivityActionsProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editName, setEditName] = useState(activity.name);
  const [editDate, setEditDate] = useState(activity.date);

  const { isUpdating, isDeleting } = useSelector(
    (state: RootState) => state.activity
  );

  const { roleType } = useUserPermissions();

  // Vérifier si l'utilisateur peut modifier cette activité
  const canModifyActivity =
    roleType.includes(RoleType.ADMINISTRATEUR) ||
    activity.category !== "Salon/Conférence";

  // Vérifier si l'utilisateur peut supprimer cette activité (administrateur uniquement)
  const canDeleteActivity = roleType.includes(RoleType.ADMINISTRATEUR);

  const handleEdit = async () => {
    if (editName.trim() && editDate.trim()) {
      try {
        await dispatch(
          updateActivityThunk({
            id: activity.id,
            data: { name: editName.trim(), date: editDate.trim() },
          })
        ).unwrap();
        setIsEditOpen(false);
      } catch (error) {
        console.error("Failed to update activity:", error);
      }
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteActivityThunk(activity.id)).unwrap();
      setIsDeleteOpen(false);
    } catch (error) {
      console.error("Failed to delete activity:", error);
    }
  };

  const formatDateForInput = (dateString: string) => {
    if (!dateString || dateString.trim() === "") return "";
    const date = new Date(dateString);
    if (date.getFullYear() < 2000) return "";
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="flex items-center gap-2">
      {/* Edit Button */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            disabled={isUpdating || !canModifyActivity}
            title={
              !canModifyActivity
                ? "Vous n'avez pas les permissions pour modifier cette activité"
                : ""
            }
            type="button"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier l'activité</DialogTitle>
            <DialogDescription>
              Modifiez le nom et la date de l'activité.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom
              </Label>
              <Input
                id="name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="col-span-3"
                placeholder="Nom de l'activité"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={formatDateForInput(editDate)}
                onChange={(e) => setEditDate(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditOpen(false)}
            >
              Annuler
            </Button>
            <Button
              type="button"
              onClick={handleEdit}
              disabled={!editName.trim() || !editDate.trim() || isUpdating}
            >
              {isUpdating ? "Modification..." : "Modifier"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Button */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            disabled={isDeleting || !canDeleteActivity}
            title={
              !canDeleteActivity
                ? "Seuls les administrateurs peuvent supprimer des activités"
                : ""
            }
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Supprimer l'activité</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer l'activité "{activity.name}" ?
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
            >
              Annuler
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

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
          onRowDoubleClick={handleRowClick}
          // searchKey="name"
          // searchPlaceholder="Rechercher par nom d'activité..."
        />
      </div>
    </Section>
  );
}
