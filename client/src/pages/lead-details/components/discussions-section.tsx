import { useState, useEffect } from "react";
import { Lead } from "@/types/lead";
import { Discussion } from "@/types/discussion";
import { FormSection } from "@/components/form-components/form-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import {
  CreateDiscussionDrawer,
  EditDiscussionDrawer,
} from "./create-discussion-drawer";
import { Calendar, MessageSquare, Edit, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  fetchDiscussionsByLeadId,
  deleteDiscussion,
} from "@/store/adapters/discussions/discussions.adapter";

interface DiscussionsSectionProps {
  lead: Lead;
}

export const DiscussionsSection = ({ lead }: DiscussionsSectionProps) => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] =
    useState<Discussion | null>(null);

  useEffect(() => {
    loadDiscussions();
  }, [lead.ID]);

  const loadDiscussions = async () => {
    setIsLoading(true);
    try {
      const data = await fetchDiscussionsByLeadId(lead.ID);
      setDiscussions(data);
    } catch (error) {
      console.error("Error loading discussions:", error);
      toast.error("Erreur lors du chargement des discussions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDiscussion = async (id: number) => {
    setIsLoading(true);
    try {
      await deleteDiscussion(id);
      toast.success("Discussion supprimée avec succès");
      loadDiscussions();
    } catch (error) {
      console.error("Error deleting discussion:", error);
      toast.error("Erreur lors de la suppression de la discussion");
    } finally {
      setIsLoading(false);
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
    loadDiscussions();
  };

  const handleDiscussionUpdated = () => {
    loadDiscussions();
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
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(discussion.date_discussion)}</span>
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
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </ConfirmationDialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-wrap text-black font-medium">
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
