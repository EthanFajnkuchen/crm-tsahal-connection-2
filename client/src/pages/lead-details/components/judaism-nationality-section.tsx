import { useForm, useWatch } from "react-hook-form";
import { Lead } from "@/types/lead";
import { FormInput } from "@/components/form-components/form-input";
import {
  FormSection,
  FormSubSection,
} from "@/components/form-components/form-section";
import { FormDropdown } from "@/components/form-components/form-dropdown";
import { FormDatePicker } from "@/components/form-components/form-date-picker";
import { JUDAISM } from "@/i18n/judaism";

import { useState, useEffect } from "react";
import { NATIONALITY } from "@/i18n/nationality";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { updateLeadThunk } from "@/store/thunks/lead-details/lead-details.thunk";
import {
  createChangeRequestThunk,
  getChangeRequestsByLeadIdThunk,
} from "@/store/thunks/change-request/change-request.thunk";
import { toast } from "sonner";
import { processJudaismNationalityData } from "../setters/judaism-nationality-setter";
import { useUserPermissions } from "@/hooks/use-user-permissions";
import { RoleType } from "@/types/role-types";
import { CreateChangeRequestDto, ChangeRequest } from "@/types/change-request";
import { useAuth0 } from "@auth0/auth0-react";

interface JudaismNationalitySectionProps {
  lead: Lead;
  changeRequestsByLead: ChangeRequest[];
}

export const JudaismNationalitySection = ({
  lead,
  changeRequestsByLead,
}: JudaismNationalitySectionProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth0();
  const { roleType } = useUserPermissions();

  const [mode, setMode] = useState<"EDIT" | "VIEW">("VIEW");
  const [localIsLoading, setLocalIsLoading] = useState(false);
  const { control, handleSubmit, reset } = useForm<Partial<Lead>>({
    defaultValues: {
      StatutLoiRetour: lead.StatutLoiRetour || "",
      conversionDate: lead.conversionDate || "",
      conversionAgency: lead.conversionAgency || "",
      statutResidentIsrael: lead.statutResidentIsrael || "",
      anneeAlyah: lead.anneeAlyah || "",
      numberOfNationalities: lead.numberOfNationalities || "",
      nationality1: lead.nationality1 || "",
      passportNumber1: lead.passportNumber1 || "",
      nationality2: lead.nationality2 || "",
      passportNumber2: lead.passportNumber2 || "",
      nationality3: lead.nationality3 || "",
      passportNumber3: lead.passportNumber3 || "",
      hasIsraeliID: lead.hasIsraeliID || "",
      israeliIDNumber: lead.israeliIDNumber || "",
    },
  });

  useEffect(() => {
    reset({
      StatutLoiRetour: lead.StatutLoiRetour || "",
      conversionDate: lead.conversionDate || "",
      conversionAgency: lead.conversionAgency || "",
      statutResidentIsrael: lead.statutResidentIsrael || "",
      anneeAlyah: lead.anneeAlyah || "",
      numberOfNationalities: lead.numberOfNationalities || "",
      nationality1: lead.nationality1 || "",
      passportNumber1: lead.passportNumber1 || "",
      nationality2: lead.nationality2 || "",
      passportNumber2: lead.passportNumber2 || "",
      nationality3: lead.nationality3 || "",
      passportNumber3: lead.passportNumber3 || "",
      hasIsraeliID: lead.hasIsraeliID || "",
      israeliIDNumber: lead.israeliIDNumber || "",
    });
  }, [lead, reset]);

  const statutLoiRetour = useWatch({ control, name: "StatutLoiRetour" });
  const statutResidentIsrael = useWatch({
    control,
    name: "statutResidentIsrael",
  });
  const numberOfNationalities = useWatch({
    control,
    name: "numberOfNationalities",
  });

  const hasIsraeliID = useWatch({
    control,
    name: "hasIsraeliID",
  });

  const handleModeChange = () => {
    setMode((prevMode) => (prevMode === "VIEW" ? "EDIT" : "VIEW"));
  };

  const handleSave = async (data: Partial<Lead>) => {
    setLocalIsLoading(true);
    try {
      // Apply the same transformations as before
      const formattedData = processJudaismNationalityData(data);

      // Create originalLead with the same transformations for accurate comparison
      const originalLeadFormatted = processJudaismNationalityData(
        lead
      ) as Partial<Lead>;

      // Detect changes between formatted data and original formatted lead
      const changes = detectChanges(
        formattedData as Partial<Lead>,
        originalLeadFormatted
      );

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
            updateData: formattedData,
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

  // Helper function to format dates for display
  const formatDateForDisplay = (value: string, fieldName: string): string => {
    if (!value) return value;

    // Check if it's a date field
    const dateFields = ["conversionDate"];

    if (dateFields.includes(fieldName)) {
      const dateValue = new Date(value);
      if (!isNaN(dateValue.getTime())) {
        // Format as dd/mm/yyyy
        return dateValue.toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      }
    }

    return value;
  };

  // Get pending change details for a field
  const getPendingChangeDetails = (fieldName: string) => {
    if (roleType[0] !== RoleType.VOLONTAIRE) return null;
    const pendingChange = changeRequestsByLead.find(
      (request) => request.fieldChanged === fieldName
    );

    if (pendingChange) {
      // Format dates in the pending change details
      return {
        ...pendingChange,
        oldValue: formatDateForDisplay(pendingChange.oldValue, fieldName),
        newValue: formatDateForDisplay(pendingChange.newValue, fieldName),
      };
    }

    return null;
  };

  // Function to detect changes between original lead and form data
  const detectChanges = (
    formData: Partial<Lead>,
    originalLead: Partial<Lead>
  ) => {
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

    // Helper function to format dates for display
    const formatValueForDisplay = (value: any, fieldName: string): string => {
      if (value === null || value === undefined) return "";

      // Check if it's a date field
      const dateFields = ["conversionDate"];

      if (dateFields.includes(fieldName)) {
        const dateValue = new Date(value);
        if (!isNaN(dateValue.getTime())) {
          // Format as dd/mm/yyyy
          return dateValue.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
        }
      }

      return String(value);
    };

    // Check for changes in each field that can be modified in this section
    const fieldsToCheck = [
      "StatutLoiRetour",
      "conversionDate",
      "conversionAgency",
      "statutResidentIsrael",
      "anneeAlyah",
      "hasIsraeliID",
      "israeliIDNumber",
      "numberOfNationalities",
      "nationality1",
      "passportNumber1",
      "nationality2",
      "passportNumber2",
      "nationality3",
      "passportNumber3",
    ];

    fieldsToCheck.forEach((fieldName) => {
      const formValue = toString(formData[fieldName as keyof Lead]);
      const originalValue = toString(originalLead[fieldName as keyof Lead]);

      // Only create change request if value changed AND no pending change request exists
      if (formValue !== originalValue && !hasFieldPendingChanges(fieldName)) {
        changes.push({
          fieldChanged: fieldName,
          oldValue: formatValueForDisplay(
            originalLead[fieldName as keyof Lead],
            fieldName
          ),
          newValue: formatValueForDisplay(
            formData[fieldName as keyof Lead],
            fieldName
          ),
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
        title="Religion & nationalités"
        mode={mode}
        onModeChange={handleModeChange}
        onSave={handleSubmit(handleSave)}
        onCancel={handleCancel}
        isLoading={localIsLoading}
      >
        <FormSubSection title="Religion">
          <FormDropdown
            control={control}
            name="StatutLoiRetour"
            label="Statut Loi Retour"
            mode={mode}
            options={JUDAISM.status_return_law.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            isLoading={localIsLoading}
            disabled={hasFieldPendingChanges("StatutLoiRetour")}
            pendingChange={hasFieldPendingChanges("StatutLoiRetour")}
            pendingChangeDetails={
              getPendingChangeDetails("StatutLoiRetour")
                ? {
                    oldValue:
                      getPendingChangeDetails("StatutLoiRetour")!.oldValue,
                    newValue:
                      getPendingChangeDetails("StatutLoiRetour")!.newValue,
                  }
                : undefined
            }
          />
          <FormDatePicker
            control={control}
            name="conversionDate"
            label="Date de conversion"
            mode={mode}
            hidden={statutLoiRetour !== "Juif converti"}
            isLoading={localIsLoading}
            readOnly={hasFieldPendingChanges("conversionDate")}
            pendingChange={hasFieldPendingChanges("conversionDate")}
            pendingChangeDetails={
              getPendingChangeDetails("conversionDate")
                ? {
                    oldValue:
                      getPendingChangeDetails("conversionDate")!.oldValue,
                    newValue:
                      getPendingChangeDetails("conversionDate")!.newValue,
                  }
                : undefined
            }
          />
          <FormDropdown
            control={control}
            name="conversionAgency"
            label="Agence de conversion"
            mode={mode}
            options={JUDAISM.conversion_organization.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            hidden={statutLoiRetour !== "Juif converti"}
            isLoading={localIsLoading}
            disabled={hasFieldPendingChanges("conversionAgency")}
            pendingChange={hasFieldPendingChanges("conversionAgency")}
            pendingChangeDetails={
              getPendingChangeDetails("conversionAgency")
                ? {
                    oldValue:
                      getPendingChangeDetails("conversionAgency")!.oldValue,
                    newValue:
                      getPendingChangeDetails("conversionAgency")!.newValue,
                  }
                : undefined
            }
          />
        </FormSubSection>

        <FormSubSection title="Nationalités">
          <FormDropdown
            control={control}
            name="statutResidentIsrael"
            label="Statut résident Israël"
            mode={mode}
            options={NATIONALITY.resident_status_in_israel.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            isLoading={localIsLoading}
            disabled={hasFieldPendingChanges("statutResidentIsrael")}
            pendingChange={hasFieldPendingChanges("statutResidentIsrael")}
            pendingChangeDetails={
              getPendingChangeDetails("statutResidentIsrael")
                ? {
                    oldValue: getPendingChangeDetails("statutResidentIsrael")!
                      .oldValue,
                    newValue: getPendingChangeDetails("statutResidentIsrael")!
                      .newValue,
                  }
                : undefined
            }
          />
          <FormInput
            control={control}
            name="anneeAlyah"
            label="Année d'Alyah"
            mode={mode}
            hidden={
              ![
                "Ole Hadash",
                "Katin Hozer",
                "Tochav Hozer",
                "Ezrah Olé",
              ].includes(statutResidentIsrael || "")
            }
            isLoading={localIsLoading}
            readOnly={hasFieldPendingChanges("anneeAlyah")}
            pendingChange={hasFieldPendingChanges("anneeAlyah")}
            pendingChangeDetails={
              getPendingChangeDetails("anneeAlyah")
                ? {
                    oldValue: getPendingChangeDetails("anneeAlyah")!.oldValue,
                    newValue: getPendingChangeDetails("anneeAlyah")!.newValue,
                  }
                : undefined
            }
          />
          <FormDropdown
            control={control}
            name="hasIsraeliID"
            label="ID Israélien"
            mode={mode}
            options={NATIONALITY.has_israeli_id.map((option) => ({
              value: option.value.toString(),
              label: option.displayName,
            }))}
            isLoading={localIsLoading}
            hidden={
              ![
                "Ole Hadash",
                "Katin Hozer",
                "Tochav Hozer",
                "Ben Meager",
              ].includes(statutResidentIsrael || "")
            }
            disabled={hasFieldPendingChanges("hasIsraeliID")}
            pendingChange={hasFieldPendingChanges("hasIsraeliID")}
            pendingChangeDetails={
              getPendingChangeDetails("hasIsraeliID")
                ? {
                    oldValue: getPendingChangeDetails("hasIsraeliID")!.oldValue,
                    newValue: getPendingChangeDetails("hasIsraeliID")!.newValue,
                  }
                : undefined
            }
          />
          <FormInput
            control={control}
            name="israeliIDNumber"
            label="ID"
            mode={mode}
            hidden={hasIsraeliID !== "Oui"}
            isLoading={localIsLoading}
            readOnly={hasFieldPendingChanges("israeliIDNumber")}
            pendingChange={hasFieldPendingChanges("israeliIDNumber")}
            pendingChangeDetails={
              getPendingChangeDetails("israeliIDNumber")
                ? {
                    oldValue:
                      getPendingChangeDetails("israeliIDNumber")!.oldValue,
                    newValue:
                      getPendingChangeDetails("israeliIDNumber")!.newValue,
                  }
                : undefined
            }
          />
          <FormDropdown
            control={control}
            name="numberOfNationalities"
            label="Nombre de nationalités"
            mode={mode}
            options={NATIONALITY.number_of_nationality.map((option) => ({
              value: option.value.toString(),
              label: option.displayName,
            }))}
            isLoading={localIsLoading}
            disabled={hasFieldPendingChanges("numberOfNationalities")}
            pendingChange={hasFieldPendingChanges("numberOfNationalities")}
            pendingChangeDetails={
              getPendingChangeDetails("numberOfNationalities")
                ? {
                    oldValue: getPendingChangeDetails("numberOfNationalities")!
                      .oldValue,
                    newValue: getPendingChangeDetails("numberOfNationalities")!
                      .newValue,
                  }
                : undefined
            }
          />
          <FormDropdown
            control={control}
            name="nationality1"
            label="Nationalité 1"
            mode={mode}
            options={NATIONALITY.nationalities.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            isLoading={localIsLoading}
            disabled={hasFieldPendingChanges("nationality1")}
            pendingChange={hasFieldPendingChanges("nationality1")}
            pendingChangeDetails={
              getPendingChangeDetails("nationality1")
                ? {
                    oldValue: getPendingChangeDetails("nationality1")!.oldValue,
                    newValue: getPendingChangeDetails("nationality1")!.newValue,
                  }
                : undefined
            }
          />
          <FormInput
            control={control}
            name="passportNumber1"
            label="Numéro de passeport 1"
            mode={mode}
            isLoading={localIsLoading}
            readOnly={hasFieldPendingChanges("passportNumber1")}
            pendingChange={hasFieldPendingChanges("passportNumber1")}
            pendingChangeDetails={
              getPendingChangeDetails("passportNumber1")
                ? {
                    oldValue:
                      getPendingChangeDetails("passportNumber1")!.oldValue,
                    newValue:
                      getPendingChangeDetails("passportNumber1")!.newValue,
                  }
                : undefined
            }
          />
          <FormDropdown
            control={control}
            name="nationality2"
            label="Nationalité 2"
            mode={mode}
            options={NATIONALITY.nationalities.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            hidden={numberOfNationalities === "1"}
            isLoading={localIsLoading}
            disabled={hasFieldPendingChanges("nationality2")}
            pendingChange={hasFieldPendingChanges("nationality2")}
            pendingChangeDetails={
              getPendingChangeDetails("nationality2")
                ? {
                    oldValue: getPendingChangeDetails("nationality2")!.oldValue,
                    newValue: getPendingChangeDetails("nationality2")!.newValue,
                  }
                : undefined
            }
          />
          <FormInput
            control={control}
            name="passportNumber2"
            label="Numéro de passeport 2"
            mode={mode}
            hidden={numberOfNationalities === "1"}
            isLoading={localIsLoading}
            readOnly={hasFieldPendingChanges("passportNumber2")}
            pendingChange={hasFieldPendingChanges("passportNumber2")}
            pendingChangeDetails={
              getPendingChangeDetails("passportNumber2")
                ? {
                    oldValue:
                      getPendingChangeDetails("passportNumber2")!.oldValue,
                    newValue:
                      getPendingChangeDetails("passportNumber2")!.newValue,
                  }
                : undefined
            }
          />
          <FormDropdown
            control={control}
            name="nationality3"
            label="Nationalité 3"
            mode={mode}
            options={NATIONALITY.nationalities.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            hidden={
              numberOfNationalities === "1" || numberOfNationalities === "2"
            }
            isLoading={localIsLoading}
            disabled={hasFieldPendingChanges("nationality3")}
            pendingChange={hasFieldPendingChanges("nationality3")}
            pendingChangeDetails={
              getPendingChangeDetails("nationality3")
                ? {
                    oldValue: getPendingChangeDetails("nationality3")!.oldValue,
                    newValue: getPendingChangeDetails("nationality3")!.newValue,
                  }
                : undefined
            }
          />

          <FormInput
            control={control}
            name="passportNumber3"
            label="Numéro de passeport 3"
            mode={mode}
            hidden={
              numberOfNationalities === "1" || numberOfNationalities === "2"
            }
            isLoading={localIsLoading}
            readOnly={hasFieldPendingChanges("passportNumber3")}
            pendingChange={hasFieldPendingChanges("passportNumber3")}
            pendingChangeDetails={
              getPendingChangeDetails("passportNumber3")
                ? {
                    oldValue:
                      getPendingChangeDetails("passportNumber3")!.oldValue,
                    newValue:
                      getPendingChangeDetails("passportNumber3")!.newValue,
                  }
                : undefined
            }
          />
        </FormSubSection>
      </FormSection>
    </form>
  );
};
