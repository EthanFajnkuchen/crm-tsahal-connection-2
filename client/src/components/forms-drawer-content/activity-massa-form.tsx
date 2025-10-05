import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { createActivityThunk } from "@/store/thunks/activity/activity.thunk";
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

const ActivityMassaDrawerContent = (
  closeDrawer: () => void
): React.ReactNode => {
  const dispatch = useDispatch<AppDispatch>();
  const { roleType, isLoading: isPermissionsLoading } = useUserPermissions();
  const [localIsLoading, setLocalIsLoading] = React.useState(false);

  // Get activity state from Redux store
  const { isCreating } = useSelector((state: RootState) => state.activity);

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
      closeDrawer();
    } catch (error) {
      console.error("Failed to create activity:", error);
      toast.error("Erreur lors de la création de l'activité");
    } finally {
      setLocalIsLoading(false);
    }
  };

  const isFormLoading = localIsLoading || isCreating;

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
    </Form>
  );
};

export default ActivityMassaDrawerContent;
