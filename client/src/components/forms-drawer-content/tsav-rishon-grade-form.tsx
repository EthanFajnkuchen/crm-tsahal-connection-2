import React, { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { bulkUpdateTsavRishonGradesThunk } from "@/store/thunks/bulk-operations/bulk-tsav-rishon.thunk";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { MILITARY } from "@/i18n/military";
import {
  SideDrawerFooter,
  SideDrawerAction,
} from "@/components/ui/side-drawer";
import type { FormValues } from "./types";
import { SingleSelect } from "../ui/single-select";
import { FormMultiSelect } from "../form-components/form-multi-select";
import { toast } from "sonner";
import { useUserPermissions } from "@/hooks/use-user-permissions";
import { RoleType } from "@/types/role-types";

const TsavRishonDrawerContent = (closeDrawer: () => void): React.ReactNode => {
  const dispatch = useDispatch<AppDispatch>();
  const { roleType, isLoading: isPermissionsLoading } = useUserPermissions();
  const [localIsLoading, setLocalIsLoading] = React.useState(false);

  // Get leads from Redux store
  const { data: leads, isLoading: isLeadsLoading } = useSelector(
    (state: RootState) => state.allLeads
  );

  // Get bulk operation state
  const { isGradesLoading: isBulkLoading } = useSelector(
    (state: RootState) => state.bulkTsavRishon
  );

  // Leads are now fetched at the page level (Form-Rapports.tsx)

  const form = useForm<FormValues>({
    defaultValues: {
      leads: [],
      noteDapar: "",
      simoulIvrit: "",
      profileMedical: "",
    },
  });

  // Check user permissions
  const userRole = roleType[0];
  const isVolunteer = userRole === RoleType.VOLONTAIRE;
  const isAdmin = userRole === RoleType.ADMINISTRATEUR;

  // Watch selected leads to enable/disable submit button
  const selectedLeads = useWatch({
    control: form.control,
    name: "leads",
  });

  const hasSelectedLeads = useMemo(() => {
    return Array.isArray(selectedLeads) && selectedLeads.length > 0;
  }, [selectedLeads]);

  // Memoized deduplicated leads
  const uniqueLeads = useMemo(() => {
    if (!leads || leads.length === 0) return [];

    // Deduplicate leads based on firstName + lastName combination
    return leads.filter((lead, index, arr) => {
      const leadName = `${lead.firstName} ${lead.lastName}`;
      return (
        arr.findIndex((l) => `${l.firstName} ${l.lastName}` === leadName) ===
        index
      );
    });
  }, [leads]);

  // Memoized leads options for FormMultiSelect
  const leadsOptions = useMemo(() => {
    return uniqueLeads.map((lead) => {
      const fullName = `${lead.firstName} ${lead.lastName}`;
      return {
        value: fullName,
        label: fullName,
      };
    });
  }, [uniqueLeads]);

  // Helper function to get lead IDs from selected names
  const getLeadIdsFromNames = (selectedNames: string[]): number[] => {
    if (!uniqueLeads) return [];

    return selectedNames
      .map((name) => {
        const lead = uniqueLeads.find(
          (l) => `${l.firstName} ${l.lastName}` === name
        );
        return lead ? lead.ID : null;
      })
      .filter((id): id is number => id !== null && !isNaN(id));
  };

  // Real submit handler
  const onSubmit = async (values: FormValues) => {
    if (!isVolunteer && !isAdmin) {
      toast.error("Accès non autorisé pour cette action");
      return;
    }

    if (!values.leads || values.leads.length === 0) {
      toast.error("Veuillez sélectionner au moins un lead");
      return;
    }

    setLocalIsLoading(true);
    try {
      const leadIds = getLeadIdsFromNames(values.leads);

      if (leadIds.length === 0) {
        toast.error("Aucun lead valide trouvé");
        return;
      }

      // Prepare bulk update data
      const bulkData = {
        leadIds,
        daparNote: values.noteDapar || undefined,
        medicalProfile: values.profileMedical || undefined,
        hebrewScore: values.simoulIvrit || undefined,
        // Add other fields as needed
      };

      const result = await dispatch(
        bulkUpdateTsavRishonGradesThunk(bulkData)
      ).unwrap();

      if (result.failed > 0) {
        toast.warning(
          `Mise à jour partielle: ${result.updated} réussies, ${result.failed} échouées`
        );
        if (result.errors.length > 0) {
          console.error("Bulk update errors:", result.errors);
        }
      } else {
        toast.success(
          `Formulaire de Tsav Rishon soumis avec succès pour ${result.updated} lead(s)`
        );
      }

      closeDrawer();
    } catch (error) {
      console.error("Failed to submit form:", error);
      toast.error("Erreur lors de la soumission du formulaire");
    } finally {
      setLocalIsLoading(false);
    }
  };

  // Conversion des options pour le format attendu par DeselectableSelect
  const daparOptions = MILITARY.dapar_grades.map(({ value, displayName }) => ({
    value: String(value),
    label: displayName,
  }));

  const hebrewOptions = MILITARY.hebrew_grade.map(({ value, displayName }) => ({
    value: String(value),
    label: displayName,
  }));

  const medicalOptions = MILITARY.medical_profile.map(
    ({ value, displayName }) => ({
      value: String(value),
      label: displayName,
    })
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 px-4"
        id="tsav-rishon-form"
      >
        {/* Multi-select Leads avec composant générique */}
        <FormMultiSelect
          control={form.control}
          name="leads"
          label="Futur(e)s soldat(e)s"
          options={leadsOptions}
          placeholder="Sélectionner des leads"
          searchPlaceholder={`Rechercher parmi ${leadsOptions.length} leads...`}
          loadingText="Chargement des leads..."
          emptyText="Aucun lead trouvé"
          isLoading={isLeadsLoading || localIsLoading}
        />

        <FormField
          control={form.control}
          name="noteDapar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note Dapar</FormLabel>
              <FormControl>
                <SingleSelect
                  options={daparOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Sélectionner une note"
                  disabled={localIsLoading}
                  isLoading={localIsLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Simoul Ivrit avec DeselectableSelect */}
        <FormField
          control={form.control}
          name="simoulIvrit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Simoul Ivrit</FormLabel>
              <FormControl>
                <SingleSelect
                  options={hebrewOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Sélectionner une note"
                  disabled={localIsLoading}
                  isLoading={localIsLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Profil Médical avec DeselectableSelect */}
        <FormField
          control={form.control}
          name="profileMedical"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profil médical</FormLabel>
              <FormControl>
                <SingleSelect
                  options={medicalOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Sélectionner un profil"
                  disabled={localIsLoading}
                  isLoading={localIsLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <SideDrawerFooter>
          <SideDrawerAction
            onSave={() => console.log(form.getValues())}
            buttonContent={localIsLoading ? "Enregistrement..." : "Enregistrer"}
            type="submit"
            formId="tsav-rishon-form"
            disabled={
              localIsLoading ||
              isPermissionsLoading ||
              isBulkLoading ||
              !hasSelectedLeads
            }
          />
        </SideDrawerFooter>
      </form>
    </Form>
  );
};

export default TsavRishonDrawerContent;
