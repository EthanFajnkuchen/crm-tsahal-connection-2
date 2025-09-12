import React, { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchAllLeadsThunk } from "@/store/thunks/data/all-leads.thunk";
import { bulkUpdateTsavRishonDateThunk } from "@/store/thunks/bulk-operations/bulk-tsav-rishon.thunk";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  SideDrawerFooter,
  SideDrawerAction,
} from "@/components/ui/side-drawer";
import type { TsavRishonDateFormValues } from "./types";
import { FormMultiSelect } from "../form-components/form-multi-select";
import { FormDatePicker } from "../form-components/form-date-picker";
import { SingleSelect } from "../ui/single-select";
import { MILITARY } from "@/i18n/military";
import { toast } from "sonner";
import { useUserPermissions } from "@/hooks/use-user-permissions";
import { RoleType } from "@/types/role-types";

const TsavRishonDateDrawerContent = (
  closeDrawer: () => void
): React.ReactNode => {
  const dispatch = useDispatch<AppDispatch>();
  const { roleType, isLoading: isPermissionsLoading } = useUserPermissions();
  const [localIsLoading, setLocalIsLoading] = React.useState(false);

  // Get leads from Redux store
  const { data: leads, isLoading: isLeadsLoading } = useSelector(
    (state: RootState) => state.allLeads
  );

  // Get bulk operation state
  const { isDateLoading: isBulkLoading } = useSelector(
    (state: RootState) => state.bulkTsavRishon
  );

  // Fetch leads on component mount (only once)
  useEffect(() => {
    if (!leads || leads.length === 0) {
      dispatch(fetchAllLeadsThunk());
    }
  }, [dispatch]); // Only depend on dispatch to avoid unnecessary re-fetches

  const form = useForm<TsavRishonDateFormValues>({
    defaultValues: {
      leads: [],
      tsavRishonDate: "",
      recruitmentCenter: "",
    },
  });

  // Check user permissions
  const userRole = roleType[0];
  const isVolunteer = userRole === RoleType.VOLONTAIRE;
  const isAdmin = userRole === RoleType.ADMINISTRATEUR;

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

  // Recruitment center options
  const recruitmentCenterOptions = MILITARY.recruitment_center_tsav_rishon.map(
    ({ value, displayName }) => ({
      value: String(value),
      label: displayName,
    })
  );

  // Watch form values to determine if submit button should be disabled
  const watchedValues = useWatch({
    control: form.control,
    name: ["leads", "tsavRishonDate", "recruitmentCenter"],
  });

  const [selectedLeads, tsavRishonDate, recruitmentCenter] = watchedValues;

  // Check if form is valid for submission
  const isFormValid = useMemo(() => {
    const hasLeads = Array.isArray(selectedLeads) && selectedLeads.length > 0;
    const hasDate = tsavRishonDate && tsavRishonDate.trim() !== "";
    const hasRecruitmentCenter =
      recruitmentCenter && recruitmentCenter.trim() !== "";

    return hasLeads && hasDate && hasRecruitmentCenter;
  }, [selectedLeads, tsavRishonDate, recruitmentCenter]);

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
  const onSubmit = async (values: TsavRishonDateFormValues) => {
    if (!isVolunteer && !isAdmin) {
      toast.error("Accès non autorisé pour cette action");
      return;
    }

    if (!values.leads || values.leads.length === 0) {
      toast.error("Veuillez sélectionner au moins un lead");
      return;
    }

    if (!values.tsavRishonDate) {
      toast.error("Veuillez sélectionner une date de Tsav Rishon");
      return;
    }

    if (!values.recruitmentCenter.trim()) {
      toast.error("Veuillez saisir le lieu de recrutement");
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
        tsavRishonDate: values.tsavRishonDate,
        recruitmentCenter: values.recruitmentCenter,
      };

      const result = await dispatch(
        bulkUpdateTsavRishonDateThunk(bulkData)
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
          `Date et lieu Tsav Rishon mis à jour avec succès pour ${result.updated} lead(s).`
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 px-4"
        id="tsav-rishon-date-form"
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
          isLoading={isLeadsLoading}
        />

        {/* Date du Tsav Rishon */}
        <FormDatePicker
          control={form.control as any}
          name="tsavRishonDate"
          label="Date du Tsav Rishon"
          mode="EDIT"
          isLoading={localIsLoading}
          allowFuture={true}
          maxFutureYears={3}
        />

        {/* Lieu de recrutement */}
        <FormField
          control={form.control}
          name="recruitmentCenter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lieu de recrutement</FormLabel>
              <FormControl>
                <SingleSelect
                  options={recruitmentCenterOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Sélectionner un lieu"
                  disabled={localIsLoading}
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
            formId="tsav-rishon-date-form"
            disabled={
              localIsLoading ||
              isPermissionsLoading ||
              isBulkLoading ||
              !isFormValid
            }
          />
        </SideDrawerFooter>
      </form>
    </Form>
  );
};

export default TsavRishonDateDrawerContent;
