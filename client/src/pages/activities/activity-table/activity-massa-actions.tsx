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
import { RootState, AppDispatch } from "@/store/store";
import {
  updateActiviteMassaThunk,
  deleteActiviteMassaThunk,
} from "@/store/thunks/activite-massa/activite-massa.thunk";
import { useUserPermissions } from "@/hooks/use-user-permissions";
import { RoleType } from "@/types/role-types";

// Type pour les activités Massa combinées
type CombinedActivity = {
  id: number;
  name: string;
  category: string;
  type: "massa";
  date: string;
  id_activite_type: number;
  programName: string;
  programYear: string;
};

interface ActivityMassaActionsProps {
  activity: CombinedActivity;
  onSuccess?: () => void;
}

export function ActivityMassaActions({
  activity,
  onSuccess,
}: ActivityMassaActionsProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editDate, setEditDate] = useState(activity.date);

  const { isUpdating, isDeleting } = useSelector(
    (state: RootState) => state.activiteMassa
  );

  const { roleType } = useUserPermissions();

  // Vérifier si l'utilisateur peut modifier cette activité
  const canModifyActivity =
    roleType.includes(RoleType.ADMINISTRATEUR) ||
    roleType.includes(RoleType.VOLONTAIRE);

  // Vérifier si l'utilisateur peut supprimer cette activité (administrateur uniquement)
  const canDeleteActivity = roleType.includes(RoleType.ADMINISTRATEUR);

  const handleEdit = async () => {
    if (editDate.trim()) {
      try {
        await dispatch(
          updateActiviteMassaThunk({
            id: activity.id,
            data: { date: editDate.trim() },
          })
        ).unwrap();
        setIsEditOpen(false);
        onSuccess?.();
      } catch (error) {
        console.error("Failed to update activite massa:", error);
      }
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteActiviteMassaThunk(activity.id)).unwrap();
      setIsDeleteOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to delete activite massa:", error);
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
      {/* Edit Button - Only for date */}
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
                : "Modifier la date de l'activité Massa/École"
            }
            type="button"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier la date de l'activité</DialogTitle>
            <DialogDescription>
              Vous pouvez uniquement modifier la date de cette activité
              Massa/École.
              <br />
              <strong>Activité :</strong> {activity.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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
              disabled={!editDate.trim() || isUpdating}
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
                : "Supprimer cette activité Massa/École"
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
              <br />
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
