import React, { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { bulkUpdateGiyusThunk } from "@/store/thunks/bulk-operations/bulk-giyus.thunk";
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
import type { GiyusFormValues } from "./types";
import { SingleSelect } from "../ui/single-select";
import { FormMultiSelect } from "../form-components/form-multi-select";
import { FormDatePicker } from "../form-components/form-date-picker";
import { toast } from "sonner";
import { useUserPermissions } from "@/hooks/use-user-permissions";
import { RoleType } from "@/types/role-types";

const GiyusDrawerContent = (closeDrawer: () => void): React.ReactNode => {
  const dispatch = useDispatch<AppDispatch>();
  const { roleType, isLoading: isPermissionsLoading } = useUserPermissions();
  const [localIsLoading, setLocalIsLoading] = React.useState(false);

  // Get leads from Redux store
  const { data: leads, isLoading: isLeadsLoading } = useSelector(
    (state: RootState) => state.allLeads
  );

  // Get bulk operation state
  const { isLoading: isBulkLoading } = useSelector(
    (state: RootState) => state.bulkGiyus
  );

  // Leads are now fetched at the page level (Form-Rapports.tsx)

  const form = useForm<GiyusFormValues>({
    defaultValues: {
      leads: [],
      giyusDate: "",
      michveAlonTraining: "",
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
    if (!uniqueLeads) {
      return [];
    }

    return selectedNames
      .map((name) => {
        const lead = uniqueLeads.find(
          (l) => `${l.firstName} ${l.lastName}` === name
        );
        console.log(
          `Looking for: "${name}", Found:`,
          lead
            ? `${lead.firstName} ${lead.lastName} (ID: ${lead.ID})`
            : "NOT FOUND"
        );
        return lead ? lead.ID : null;
      })
      .filter((id): id is number => id !== null && !isNaN(id));
  };

  // Real submit handler
  const onSubmit = async (values: GiyusFormValues) => {
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
      const bulkData: any = {
        leadIds,
      };

      if (values.giyusDate) {
        bulkData.giyusDate = values.giyusDate;
      }

      if (values.michveAlonTraining?.trim()) {
        bulkData.michveAlonTraining = values.michveAlonTraining.trim();
      }

      console.log("Submitting bulk Giyus update:", bulkData);

      const result = await dispatch(bulkUpdateGiyusThunk(bulkData)).unwrap();

      if (result.failed > 0) {
        toast.warning(
          `Mise à jour partielle: ${result.updated} réussies, ${result.failed} échouées`
        );
        if (result.errors.length > 0) {
          console.error("Errors:", result.errors);
        }
      } else {
        toast.success(
          `Formulaire Giyus soumis avec succès pour ${result.updated} lead(s)`
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

  // Conversion des options pour le format attendu par SingleSelect
  const michveAlonOptions = MILITARY.program_at_michve_alon.map(
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
        id="giyus-form"
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

        {/* Date de Giyus */}
        <FormDatePicker
          control={form.control as any}
          name="giyusDate"
          label="Date de Giyus"
          mode="EDIT"
          isLoading={localIsLoading}
          allowFuture={true}
          maxFutureYears={3}
        />

        {/* Programme Michve Alon */}
        <FormField
          control={form.control}
          name="michveAlonTraining"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Programme Michve Alon</FormLabel>
              <FormControl>
                <SingleSelect
                  options={michveAlonOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Sélectionner un programme"
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
            formId="giyus-form"
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

export default GiyusDrawerContent;
