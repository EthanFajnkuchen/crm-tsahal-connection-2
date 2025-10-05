import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Edit, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { Activity } from "@/store/adapters/activity/activity.adapter";
import { RootState, AppDispatch } from "@/store/store";
import {
  updateActivityThunk,
  deleteActivityThunk,
} from "@/store/thunks/activity/activity.thunk";
import { useUserPermissions } from "@/hooks/use-user-permissions";
import { RoleType } from "@/types/role-types";

interface ActivityActionsProps {
  activity: Activity;
}

export function ActivityActions({ activity }: ActivityActionsProps) {
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
