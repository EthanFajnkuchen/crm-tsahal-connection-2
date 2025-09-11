import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Lead } from "@/types/lead";
import { FormSection } from "@/components/form-components/form-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import {
  CreateDiscussionDrawer,
  EditDiscussionDrawer,
} from "./create-discussion-drawer";
import {
  Calendar,
  MessageSquare,
  Edit,
  Trash2,
  Plus,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { AppDispatch, RootState } from "@/store/store";
import {
  fetchDiscussionsByLeadIdThunk,
  deleteDiscussionThunk,
} from "@/store/thunks/discussions/discussions.thunk";
import { useState } from "react";
import { Discussion } from "@/types/discussion";

interface DiscussionsSectionProps {
  lead: Lead;
}

export const DiscussionsSection = ({ lead }: DiscussionsSectionProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] =
    useState<Discussion | null>(null);

  const { discussions, isLoading, error, isDeleting, currentLeadId } =
    useSelector((state: RootState) => state.discussions);

  useEffect(() => {
    // Only fetch if we don't have discussions for this lead or if it's a different lead
    if (currentLeadId !== lead.ID) {
      dispatch(fetchDiscussionsByLeadIdThunk(lead.ID));
    }
  }, [dispatch, lead.ID, currentLeadId]);

  useEffect(() => {
    if (error) {
      toast.error("Erreur lors du chargement des discussions");
    }
  }, [error]);

  const handleDeleteDiscussion = async (id: number) => {
    try {
      await dispatch(deleteDiscussionThunk(id)).unwrap();
      toast.success("Discussion supprimée avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression de la discussion");
    }
  };

  const handleEditDiscussion = (discussion: Discussion) => {
    setSelectedDiscussion(discussion);
    setIsEditDrawerOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDiscussionCreated = () => {
    // No need to manually reload, Redux will handle the state update
  };

  const handleDiscussionUpdated = () => {
    // No need to manually reload, Redux will handle the state update
  };

  return (
    <>
      <FormSection
        title={
          <div className="flex items-center gap-2">
            Discussions ({discussions.length})
          </div>
        }
        notEditable={true}
      >
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => setIsCreateDrawerOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une discussion
            </Button>
          </div>

          {/* Discussions List */}
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-gray-500">Chargement des discussions...</div>
            </div>
          ) : discussions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Aucune discussion</p>
              <p className="text-sm">
                Commencez par ajouter une première discussion avec ce lead.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {discussions.map((discussion) => (
                <Card key={discussion.ID} className="border-gray-200">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col  gap-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(discussion.date_discussion)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="w-4 h-4" />
                          <span>{discussion.created_by}</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          onClick={() => handleEditDiscussion(discussion)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-blue-100"
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                        </Button>
                        <ConfirmationDialog
                          title="Supprimer la discussion"
                          description="Êtes-vous sûr de vouloir supprimer cette discussion ? Cette action est irréversible."
                          confirmText="Supprimer"
                          cancelText="Annuler"
                          variant="destructive"
                          onConfirm={() =>
                            handleDeleteDiscussion(discussion.ID)
                          }
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-red-100"
                            disabled={isDeleting}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </ConfirmationDialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-wrap text-gray-700">
                      {discussion.contenu}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </FormSection>

      {/* Create Discussion Drawer */}
      <CreateDiscussionDrawer
        isOpen={isCreateDrawerOpen}
        onClose={() => setIsCreateDrawerOpen(false)}
        lead={lead}
        onDiscussionCreated={handleDiscussionCreated}
      />

      {/* Edit Discussion Drawer */}
      <EditDiscussionDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => {
          setIsEditDrawerOpen(false);
          setSelectedDiscussion(null);
        }}
        lead={lead}
        discussion={selectedDiscussion}
        onDiscussionUpdated={handleDiscussionUpdated}
      />
    </>
  );
};
