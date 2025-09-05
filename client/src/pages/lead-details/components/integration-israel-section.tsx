import { useForm, useWatch } from "react-hook-form";
import { Lead } from "@/types/lead";
import {
  FormSection,
  FormSubSection,
} from "@/components/form-components/form-section";
import { FormDropdown } from "@/components/form-components/form-dropdown";
import { useState, useEffect } from "react";
import { INTEGRATION_IN_ISRAEL } from "@/i18n/integration-in-israel";
import { FormInput } from "@/components/form-components/form-input";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { updateLeadThunk } from "@/store/thunks/lead-details/lead-details.thunk";
import {
  createChangeRequestThunk,
  getChangeRequestsByLeadIdThunk,
} from "@/store/thunks/change-request/change-request.thunk";
import { toast } from "sonner";
import { useUserPermissions } from "@/hooks/use-user-permissions";
import { RoleType } from "@/types/role-types";
import { CreateChangeRequestDto, ChangeRequest } from "@/types/change-request";
import { useAuth0 } from "@auth0/auth0-react";

interface IntegrationIsraelSectionProps {
  lead: Lead;
  changeRequestsByLead: ChangeRequest[];
}

export const IntegrationIsraelSection = ({
  lead,
  changeRequestsByLead,
}: IntegrationIsraelSectionProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth0();
  const { roleType } = useUserPermissions();

  const [mode, setMode] = useState<"EDIT" | "VIEW">("VIEW");
  const [localIsLoading, setLocalIsLoading] = useState(false);
  const { control, handleSubmit, reset } = useForm<Partial<Lead>>({
    defaultValues: {
      arrivalAge: lead.arrivalAge || "",
      programParticipation: lead.programParticipation || "",
      programName: lead.programName || "",
      schoolYears: lead.schoolYears || "",
      armyDeferralProgram: lead.armyDeferralProgram || "",
      programNameHebrewArmyDeferral: lead.programNameHebrewArmyDeferral || "",
    },
  });

  useEffect(() => {
    reset({
      arrivalAge: lead.arrivalAge || "",
      programParticipation: lead.programParticipation || "",
      programName: lead.programName || "",
      schoolYears: lead.schoolYears || "",
      armyDeferralProgram: lead.armyDeferralProgram || "",
      programNameHebrewArmyDeferral: lead.programNameHebrewArmyDeferral || "",
    });
  }, [lead, reset]);

  const programParticipation = useWatch({
    control,
    name: "programParticipation",
  });
  const arrivalAge = useWatch({
    control,
    name: "arrivalAge",
  });

  const armyDeferralProgram = useWatch({
    control,
    name: "armyDeferralProgram",
  });

  const handleModeChange = () => {
    setMode((prevMode) => (prevMode === "VIEW" ? "EDIT" : "VIEW"));
  };

  const handleSave = async (data: Partial<Lead>) => {
    setLocalIsLoading(true);
    try {
      // Detect changes between form data and original lead
      const changes = detectChanges(data, lead);

      // Check user role and handle accordingly
      const userRole = roleType[0];

      if (userRole === RoleType.VOLONTAIRE) {
        // For volunteers: create change requests instead of updating directly
        if (changes.length > 0) {
          await createChangeRequests(changes);
          // Reset form to original values since changes are only requests, not actual updates
          reset();
          toast.success(
            `${changes.length} demande(s) de modification envoyée(s) pour approbation`
          );
        } else {
          toast.info("Aucun changement détecté");
        }
        setMode("VIEW");
      } else if (userRole === RoleType.ADMINISTRATEUR) {
        // For administrators: update the lead directly (existing behavior)
        await dispatch(
          updateLeadThunk({
            id: lead.ID.toString(),
            updateData: data,
          })
        ).unwrap();

        toast.success("Le lead a été modifié avec succès");
        setMode("VIEW");
      } else {
        toast.error("Rôle utilisateur non reconnu");
      }
    } catch (error) {
      console.error("Failed to save changes:", error);
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setLocalIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setMode("VIEW");
  };

  // Check if a field has pending change requests
  const hasFieldPendingChanges = (fieldName: string): boolean => {
    if (roleType[0] !== RoleType.VOLONTAIRE) return false;
    return changeRequestsByLead.some(
      (request) => request.fieldChanged === fieldName
    );
  };

  // Get pending change details for a field
  const getPendingChangeDetails = (fieldName: string) => {
    if (roleType[0] !== RoleType.VOLONTAIRE) return null;
    const pendingChange = changeRequestsByLead.find(
      (request) => request.fieldChanged === fieldName
    );

    return pendingChange || null;
  };

  // Function to detect changes between original lead and form data
  const detectChanges = (formData: Partial<Lead>, originalLead: Lead) => {
    const changes: Array<{
      fieldChanged: string;
      oldValue: string;
      newValue: string;
    }> = [];

    // Helper function to safely convert values to strings
    const toString = (value: any): string => {
      if (value === null || value === undefined) return "";
      return String(value);
    };

    // Check for changes in each field that can be modified in this section
    const fieldsToCheck = [
      "arrivalAge",
      "programParticipation",
      "programName",
      "schoolYears",
      "armyDeferralProgram",
      "programNameHebrewArmyDeferral",
    ];

    fieldsToCheck.forEach((fieldName) => {
      const formValue = toString(formData[fieldName as keyof Lead]);
      const originalValue = toString(originalLead[fieldName as keyof Lead]);

      // Only create change request if value changed AND no pending change request exists
      if (formValue !== originalValue && !hasFieldPendingChanges(fieldName)) {
        changes.push({
          fieldChanged: fieldName,
          oldValue: originalValue,
          newValue: formValue,
        });
      }
    });

    return changes;
  };

  // Function to create change requests for detected changes
  const createChangeRequests = async (
    changes: Array<{
      fieldChanged: string;
      oldValue: string;
      newValue: string;
    }>
  ) => {
    const changedBy = user?.name || user?.email || "Unknown User";
    const dateModified = new Date().toISOString();

    const changeRequestPromises = changes.map((change) => {
      const changeRequestDto: CreateChangeRequestDto = {
        leadId: lead.ID,
        fieldChanged: change.fieldChanged,
        oldValue: change.oldValue,
        newValue: change.newValue,
        changedBy,
        dateModified,
      };

      return dispatch(createChangeRequestThunk(changeRequestDto));
    });

    await Promise.all(changeRequestPromises);

    // Refresh the change requests list to show the new pending changes immediately
    await dispatch(getChangeRequestsByLeadIdThunk(lead.ID));
  };

  return (
    <form onSubmit={handleSubmit(handleSave)}>
      <FormSection
        title="Intégration en Israël"
        mode={mode}
        onModeChange={handleModeChange}
        onSave={handleSubmit(handleSave)}
        onCancel={handleCancel}
        isLoading={localIsLoading}
      >
        <FormSubSection>
          <FormDropdown
            control={control}
            name="arrivalAge"
            label="Age d'arrivée en Israël"
            mode={mode}
            options={INTEGRATION_IN_ISRAEL.age_get_in_israel.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            isLoading={localIsLoading}
            disabled={hasFieldPendingChanges("arrivalAge")}
            pendingChange={hasFieldPendingChanges("arrivalAge")}
            pendingChangeDetails={
              getPendingChangeDetails("arrivalAge")
                ? {
                    oldValue: getPendingChangeDetails("arrivalAge")!.oldValue,
                    newValue: getPendingChangeDetails("arrivalAge")!.newValue,
                  }
                : undefined
            }
          />
          <FormDropdown
            control={control}
            name="programParticipation"
            label="Programme d'intégration"
            mode={mode}
            options={INTEGRATION_IN_ISRAEL.integration_programs.map(
              (option) => ({
                value: option.value,
                label: option.displayName,
              })
            )}
            hidden={arrivalAge !== "Après mes 14 ans"}
            isLoading={localIsLoading}
            disabled={hasFieldPendingChanges("programParticipation")}
            pendingChange={hasFieldPendingChanges("programParticipation")}
            pendingChangeDetails={
              getPendingChangeDetails("programParticipation")
                ? {
                    oldValue: getPendingChangeDetails("programParticipation")!
                      .oldValue,
                    newValue: getPendingChangeDetails("programParticipation")!
                      .newValue,
                  }
                : undefined
            }
          />
          <FormDropdown
            control={control}
            name="programName"
            label="Nom du programme"
            mode={mode}
            options={INTEGRATION_IN_ISRAEL.integration_program_names.map(
              (option) => ({
                value: option.value,
                label: option.displayName,
              })
            )}
            hidden={
              ![
                "Massa",
                "Midrasha",
                "Université",
                "Taka",
                "Yeshiva",
                "Autre",
              ].includes(programParticipation ?? "") ||
              arrivalAge !== "Après mes 14 ans"
            }
            isLoading={localIsLoading}
            disabled={hasFieldPendingChanges("programName")}
            pendingChange={hasFieldPendingChanges("programName")}
            pendingChangeDetails={
              getPendingChangeDetails("programName")
                ? {
                    oldValue: getPendingChangeDetails("programName")!.oldValue,
                    newValue: getPendingChangeDetails("programName")!.newValue,
                  }
                : undefined
            }
          />
          <FormInput
            control={control}
            name="schoolYears"
            label="Années d'études"
            mode={mode}
            hidden={
              ![
                "Lycée francophone",
                "Massa",
                "Midrasha",
                "Naalé",
                "Université",
                "Taka",
                "Yeshiva",
                "Autre",
              ].includes(programParticipation ?? "") ||
              arrivalAge !== "Après mes 14 ans"
            }
            isLoading={localIsLoading}
            readOnly={hasFieldPendingChanges("schoolYears")}
            pendingChange={hasFieldPendingChanges("schoolYears")}
            pendingChangeDetails={
              getPendingChangeDetails("schoolYears")
                ? {
                    oldValue: getPendingChangeDetails("schoolYears")!.oldValue,
                    newValue: getPendingChangeDetails("schoolYears")!.newValue,
                  }
                : undefined
            }
          />
          <FormDropdown
            control={control}
            name="armyDeferralProgram"
            label="Programme pré-armée"
            mode={mode}
            options={INTEGRATION_IN_ISRAEL.army_deferral_programs.map(
              (option) => ({
                value: option.value,
                label: option.displayName,
              })
            )}
            isLoading={localIsLoading}
            disabled={hasFieldPendingChanges("armyDeferralProgram")}
            pendingChange={hasFieldPendingChanges("armyDeferralProgram")}
            pendingChangeDetails={
              getPendingChangeDetails("armyDeferralProgram")
                ? {
                    oldValue: getPendingChangeDetails("armyDeferralProgram")!
                      .oldValue,
                    newValue: getPendingChangeDetails("armyDeferralProgram")!
                      .newValue,
                  }
                : undefined
            }
          />
          <FormInput
            control={control}
            name="programNameHebrewArmyDeferral"
            label="Nom du programme en hébreu"
            mode={mode}
            hidden={
              !["Chnat Chirout", "Mechina", "Yeshiva", "Autre"].includes(
                armyDeferralProgram ?? ""
              )
            }
            isLoading={localIsLoading}
            readOnly={hasFieldPendingChanges("programNameHebrewArmyDeferral")}
            pendingChange={hasFieldPendingChanges(
              "programNameHebrewArmyDeferral"
            )}
            pendingChangeDetails={
              getPendingChangeDetails("programNameHebrewArmyDeferral")
                ? {
                    oldValue: getPendingChangeDetails(
                      "programNameHebrewArmyDeferral"
                    )!.oldValue,
                    newValue: getPendingChangeDetails(
                      "programNameHebrewArmyDeferral"
                    )!.newValue,
                  }
                : undefined
            }
          />
        </FormSubSection>
      </FormSection>
    </form>
  );
};
