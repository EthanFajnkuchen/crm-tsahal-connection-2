import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  createActivityThunk,
  getActivitiesThunk,
  updateActivityThunk,
  deleteActivityThunk,
} from "@/store/thunks/activity/activity.thunk";
import { Form } from "@/components/ui/form";
import {
  SideDrawerFooter,
  SideDrawerAction,
} from "@/components/ui/side-drawer";
import type { ActivityFormValues } from "./types";
import { FormInput } from "../form-components/form-input";
import { toast } from "sonner";
import { useUserPermissions } from "@/hooks/use-user-permissions";
import { RoleType } from "@/types/role-types";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

const ActivityMassaDrawerContent = (
  closeDrawer: () => void
): React.ReactNode => {
  const dispatch = useDispatch<AppDispatch>();
  const { roleType, isLoading: isPermissionsLoading } = useUserPermissions();
  const [localIsLoading, setLocalIsLoading] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [editingName, setEditingName] = React.useState("");

  // Get activity state from Redux store
  const { activities, isCreating, isLoading, isUpdating, isDeleting } =
    useSelector((state: RootState) => state.activity);

  const form = useForm<ActivityFormValues>({
    defaultValues: {
      name: "",
      date: "", // Not used for Massa activities, but keeping for type compatibility
    },
  });

  // Check user permissions
  const userRole = roleType[0];
  const isVolunteer = userRole === RoleType.VOLONTAIRE;
  const isAdmin = userRole === RoleType.ADMINISTRATEUR;

  // Filter activities for Massa/Écoles category
  const massaActivities = activities.filter(
    (activity) => activity.category === "Massa/Écoles"
  );

  // Load activities on component mount
  React.useEffect(() => {
    dispatch(getActivitiesThunk("Massa/Écoles"));
  }, [dispatch]);

  // Real submit handler
  const onSubmit = async (values: ActivityFormValues) => {
    if (!isVolunteer && !isAdmin) {
      toast.error("Accès non autorisé pour cette action");
      return;
    }

    if (!values.name?.trim()) {
      toast.error("Veuillez saisir le nom de l'activité");
      return;
    }

    setLocalIsLoading(true);
    try {
      // Prepare activity data with automatic category
      const activityData = {
        name: values.name.trim(),
        date: "", // Empty date for Massa/Écoles activities
        category: "Massa/Écoles",
      };

      console.log("Submitting activity creation:", activityData);

      const result = await dispatch(createActivityThunk(activityData)).unwrap();

      toast.success(`Activité "${result.name}" créée avec succès`);
      form.reset();
      // Refresh the activities list
      dispatch(getActivitiesThunk("Massa/Écoles"));
      closeDrawer();
    } catch (error) {
      console.error("Failed to create activity:", error);
      toast.error("Erreur lors de la création de l'activité");
    } finally {
      setLocalIsLoading(false);
    }
  };

  const isFormLoading = localIsLoading || isCreating;

  // Handle edit activity
  const handleEdit = (activity: any) => {
    setEditingId(activity.id);
    setEditingName(activity.name);
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!editingId || !editingName.trim()) return;

    try {
      await dispatch(
        updateActivityThunk({
          id: editingId,
          data: {
            name: editingName.trim(),
            date: "", // Empty date for Massa activities
          },
        })
      ).unwrap();

      toast.success("Activité modifiée avec succès");
      setEditingId(null);
      setEditingName("");
      // Refresh the activities list
      dispatch(getActivitiesThunk("Massa/Écoles"));
    } catch (error) {
      console.error("Failed to update activity:", error);
      toast.error("Erreur lors de la modification de l'activité");
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  // Handle delete activity
  const handleDelete = async (id: number) => {
    if (
      !window.confirm("Êtes-vous sûr de vouloir supprimer cette activité ?")
    ) {
      return;
    }

    try {
      await dispatch(deleteActivityThunk(id)).unwrap();
      toast.success("Activité supprimée avec succès");
      // Refresh the activities list
      dispatch(getActivitiesThunk("Massa/Écoles"));
    } catch (error) {
      console.error("Failed to delete activity:", error);
      toast.error("Erreur lors de la suppression de l'activité");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 px-4"
        id="activity-massa-form"
      >
        {/* Nom de l'activité */}
        <FormInput
          control={form.control}
          name="name"
          label="Nom de l'activité"
          placeholder="Ex: Visite école technique de Tel Aviv"
          disabled={isFormLoading}
          required
          isLoading={isFormLoading}
        />

        {/* Information sur la catégorie */}
        <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
          <strong>Catégorie :</strong> Massa/Écoles
          <br />
          <span className="text-xs">
            Cette catégorie sera automatiquement assignée à l'activité.
          </span>
        </div>

        <SideDrawerFooter>
          <SideDrawerAction
            onSave={() => console.log(form.getValues())}
            buttonContent={isFormLoading ? "Création..." : "Créer l'activité"}
            type="submit"
            formId="activity-massa-form"
            disabled={
              isFormLoading ||
              isPermissionsLoading ||
              !form.watch("name")?.trim()
            }
          />
        </SideDrawerFooter>
      </form>

      {/* Activities List */}
      <div className="mt-6 px-4">
        <h3 className="text-lg font-semibold mb-4">Activités existantes</h3>

        {isLoading ? (
          <div className="text-center py-4 text-muted-foreground">
            Chargement des activités...
          </div>
        ) : massaActivities.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            Aucune activité créée pour le moment
          </div>
        ) : (
          <div className="space-y-2">
            {massaActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 border rounded-lg bg-card"
              >
                {editingId === activity.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="flex-1 px-2 py-1 border rounded text-sm"
                      disabled={isUpdating}
                    />
                    <Button
                      size="sm"
                      onClick={handleSaveEdit}
                      disabled={isUpdating || !editingName.trim()}
                      className="h-8 px-2"
                    >
                      {isUpdating ? "..." : "✓"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancelEdit}
                      disabled={isUpdating}
                      className="h-8 px-2"
                    >
                      ✕
                    </Button>
                  </div>
                ) : (
                  <>
                    <span className="flex-1 text-sm font-medium">
                      {activity.name}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(activity)}
                        disabled={isUpdating || isDeleting}
                        className="h-8 w-8 p-0"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(activity.id)}
                        disabled={isUpdating || isDeleting}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Form>
  );
};

export default ActivityMassaDrawerContent;
