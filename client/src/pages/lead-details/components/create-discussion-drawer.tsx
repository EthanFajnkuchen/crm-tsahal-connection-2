import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Lead } from "@/types/lead";
import {
  CreateDiscussionDto,
  Discussion,
  UpdateDiscussionDto,
} from "@/types/discussion";
import {
  SideDrawer,
  SideDrawerContent,
  SideDrawerHeader,
  SideDrawerTitle,
  SideDrawerClose,
  SideDrawerAction,
} from "@/components/ui/side-drawer";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AppDispatch, RootState } from "@/store/store";
import {
  createDiscussionThunk,
  updateDiscussionThunk,
} from "@/store/thunks/discussions/discussions.thunk";
import { useAuth0 } from "@auth0/auth0-react";

interface CreateDiscussionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead;
  onDiscussionCreated: () => void;
}

interface EditDiscussionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead;
  discussion: Discussion | null;
  onDiscussionUpdated: () => void;
}

export const CreateDiscussionDrawer: React.FC<CreateDiscussionDrawerProps> = ({
  isOpen,
  onClose,
  lead,
  onDiscussionCreated,
}) => {
  const { user } = useAuth0();
  const dispatch = useDispatch<AppDispatch>();
  const { isCreating } = useSelector((state: RootState) => state.discussions);
  const [formData, setFormData] = useState({
    date_discussion: new Date().toISOString().split("T")[0],
    contenu: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.contenu.trim()) {
      toast.error("Le contenu de la discussion est requis");
      return;
    }

    try {
      const discussionData: CreateDiscussionDto = {
        id_lead: lead.ID,
        date_discussion: formData.date_discussion,
        contenu: formData.contenu,
        created_by: user?.name || "",
      };

      await dispatch(createDiscussionThunk(discussionData)).unwrap();
      toast.success("Discussion ajoutée avec succès");

      // Reset form
      setFormData({
        date_discussion: new Date().toISOString().split("T")[0],
        contenu: "",
      });

      onDiscussionCreated();
      onClose();
    } catch (error) {
      toast.error("Erreur lors de l'ajout de la discussion");
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      date_discussion: new Date().toISOString().split("T")[0],
      contenu: "",
    });
    onClose();
  };

  const handleSave = () => {
    // Form submission will be handled by the form's onSubmit
  };

  return (
    <SideDrawer isOpen={isOpen} onClose={handleClose}>
      <SideDrawerContent isOpen={isOpen}>
        <SideDrawerHeader>
          <SideDrawerTitle>Nouvelle discussion</SideDrawerTitle>
          <SideDrawerClose onClose={handleClose} />
        </SideDrawerHeader>

        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Lead</span>
            </p>
            <p className="text-sm font-medium text-black">
              {lead.firstName} {lead.lastName}
            </p>
          </div>

          <form
            id="create-discussion-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label
                htmlFor="date_discussion"
                className="text-sm font-medium text-gray-500"
              >
                Date de la discussion
              </Label>
              <p className="text-sm font-medium text-gray-900">
                {new Date().toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contenu">Contenu de la discussion</Label>
              <Textarea
                id="contenu"
                value={formData.contenu}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contenu: e.target.value,
                  })
                }
                placeholder="Décrivez le contenu de la discussion..."
                rows={8}
                className="min-h-[200px] resize-none"
                required
              />
              <p className="text-xs text-gray-500">
                Décrivez les points importants de votre échange avec ce lead.
              </p>
            </div>
          </form>
        </div>

        <SideDrawerAction
          buttonContent="Ajouter la discussion"
          onSave={handleSave}
          disabled={!formData.contenu.trim()}
          isLoading={isCreating}
          formId="create-discussion-form"
          type="submit"
        />
      </SideDrawerContent>
    </SideDrawer>
  );
};

export const EditDiscussionDrawer: React.FC<EditDiscussionDrawerProps> = ({
  isOpen,
  onClose,
  lead,
  discussion,
  onDiscussionUpdated,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isUpdating } = useSelector((state: RootState) => state.discussions);
  const [formData, setFormData] = useState({
    date_discussion: discussion?.date_discussion || "",
    contenu: discussion?.contenu || "",
  });

  // Update form data when discussion changes
  React.useEffect(() => {
    if (discussion) {
      setFormData({
        date_discussion: discussion.date_discussion,
        contenu: discussion.contenu,
      });
    }
  }, [discussion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!discussion) return;

    if (!formData.contenu.trim()) {
      toast.error("Le contenu de la discussion est requis");
      return;
    }

    try {
      const updateData: UpdateDiscussionDto = {
        date_discussion: formData.date_discussion,
        contenu: formData.contenu,
      };

      await dispatch(
        updateDiscussionThunk({
          id: discussion.ID,
          updateData,
        })
      ).unwrap();
      toast.success("Discussion modifiée avec succès");

      onDiscussionUpdated();
      onClose();
    } catch (error) {
      toast.error("Erreur lors de la modification de la discussion");
    }
  };

  const handleClose = () => {
    // Reset form when closing
    if (discussion) {
      setFormData({
        date_discussion: discussion.date_discussion,
        contenu: discussion.contenu,
      });
    }
    onClose();
  };

  const handleSave = () => {
    // Form submission will be handled by the form's onSubmit
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!discussion) return null;

  return (
    <SideDrawer isOpen={isOpen} onClose={handleClose}>
      <SideDrawerContent isOpen={isOpen}>
        <SideDrawerHeader>
          <SideDrawerTitle>Modifier la discussion</SideDrawerTitle>
          <SideDrawerClose onClose={handleClose} />
        </SideDrawerHeader>

        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Lead</span>
            </p>
            <p className="text-sm font-medium text-black">
              {lead.firstName} {lead.lastName}
            </p>
          </div>

          <form
            id="edit-discussion-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label
                htmlFor="edit_date_discussion"
                className="text-sm font-medium text-gray-500"
              >
                Date de la discussion
              </Label>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(formData.date_discussion)}
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="edit_contenu"
                className="text-sm font-medium text-gray-500"
              >
                Contenu de la discussion
              </Label>
              <Textarea
                id="edit_contenu"
                value={formData.contenu}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contenu: e.target.value,
                  })
                }
                placeholder="Décrivez le contenu de la discussion..."
                rows={8}
                className="min-h-[200px] resize-none"
                required
              />
              <p className="text-xs text-gray-500">
                Décrivez les points importants de votre échange avec ce lead.
              </p>
            </div>
          </form>
        </div>

        <SideDrawerAction
          buttonContent="Modifier la discussion"
          onSave={handleSave}
          disabled={!formData.contenu.trim()}
          isLoading={isUpdating}
          formId="edit-discussion-form"
          type="submit"
        />
      </SideDrawerContent>
    </SideDrawer>
  );
};
