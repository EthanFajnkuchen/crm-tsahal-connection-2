import { useState } from "react";
import { useDispatch } from "react-redux";
import { Trash2 } from "lucide-react";

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
import { AppDispatch } from "@/store/store";
import { deleteLeadThunk } from "@/store/thunks/data/delete-lead.thunk";
import { useUserPermissions } from "@/hooks/use-user-permissions";
import { RoleType } from "@/types/role-types";
import { Lead } from "@/types/lead";

interface DeleteLeadActionProps {
  lead: Lead;
  onSuccess?: () => void;
}

export function DeleteLeadAction({ lead, onSuccess }: DeleteLeadActionProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { roleType } = useUserPermissions();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Vérifier si l'utilisateur est administrateur
  const isAdmin = roleType.includes(RoleType.ADMINISTRATEUR);

  // Ne pas afficher le bouton si l'utilisateur n'est pas admin
  if (!isAdmin) {
    return null;
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await dispatch(deleteLeadThunk(lead.ID)).unwrap();
      setIsDeleteOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to delete lead:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          title="Supprimer le lead"
          type="button"
          onClick={(e) => e.stopPropagation()}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer ce lead ?
            <br />
            <br />
            <strong>Nom complet :</strong> {lead.firstName} {lead.lastName}
            <br />
            <strong>Email :</strong> {lead.email || "Non renseigné"}
            <br />
            <br />
            Cette action est irréversible et supprimera toutes les données
            associées à ce lead (discussions, activités, etc.).
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteOpen(false);
            }}
            disabled={isDeleting}
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            disabled={isDeleting}
          >
            {isDeleting ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
