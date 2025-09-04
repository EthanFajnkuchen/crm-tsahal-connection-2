import { useForm } from "react-hook-form";
import { Lead } from "@/types/lead";
import { FormInput } from "@/components/form-components/form-input";
import {
  FormSection,
  FormSubSection,
} from "@/components/form-components/form-section";
import { FormCheckbox } from "@/components/form-components/form-checkbox";
import { FormDropdown } from "@/components/form-components/form-dropdown";
import { FormDatePicker } from "@/components/form-components/form-date-picker";
import { RELATION } from "@/i18n/emergency-contact";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { updateLeadThunk } from "@/store/thunks/lead-details/lead-details.thunk";
import {
  createChangeRequestThunk,
  getChangeRequestsByLeadIdThunk,
} from "@/store/thunks/change-request/change-request.thunk";
import { toast } from "sonner";
import { useUserPermissions } from "@/hooks/use-user-permissions";
import { RoleType } from "@/types/role-types";
import { CreateChangeRequestDto } from "@/types/change-request";
import { useAuth0 } from "@auth0/auth0-react";

interface GeneralSectionProps {
  lead: Lead;
}

export const GeneralSection = ({ lead }: GeneralSectionProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth0();
  const { roleType } = useUserPermissions();
  const { changeRequestsByLead } = useSelector(
    (state: RootState) => state.changeRequest
  );

  const [mode, setMode] = useState<"EDIT" | "VIEW">("VIEW");
  const [localIsLoading, setLocalIsLoading] = useState(false);
  const { control, handleSubmit, reset } = useForm<Partial<Lead>>({
    defaultValues: {
      firstName: lead.firstName,
      lastName: lead.lastName,
      dateInscription: lead.dateInscription,
      birthDate: lead.birthDate,
      city: lead.city,
      gender: lead.gender || "",
      isOnlyChild: lead.isOnlyChild === "Oui" ? true : false,
      contactUrgenceFirstName: lead.contactUrgenceFirstName || "",
      contactUrgenceLastName: lead.contactUrgenceLastName || "",
      contactUrgencePhoneNumber: lead.contactUrgencePhoneNumber || "",
      contactUrgenceMail: lead.contactUrgenceMail || "",
      contactUrgenceRelation: lead.contactUrgenceRelation || "",
    },
  });

  useEffect(() => {
    reset({
      firstName: lead.firstName,
      lastName: lead.lastName,
      dateInscription: lead.dateInscription,
      birthDate: lead.birthDate,
      city: lead.city,
      gender: lead.gender || "",
      isOnlyChild: lead.isOnlyChild === "Oui" ? true : false,
      contactUrgenceFirstName: lead.contactUrgenceFirstName || "",
      contactUrgenceLastName: lead.contactUrgenceLastName || "",
      contactUrgencePhoneNumber: lead.contactUrgencePhoneNumber || "",
      contactUrgenceMail: lead.contactUrgenceMail || "",
      contactUrgenceRelation: lead.contactUrgenceRelation || "",
    });

    // Fetch pending change requests for this lead if user is a volunteer
    if (roleType[0] === RoleType.VOLONTAIRE) {
      dispatch(getChangeRequestsByLeadIdThunk(lead.ID));
    }
  }, [lead, reset, dispatch, roleType]);

  const handleModeChange = () => {
    setMode((prevMode) => (prevMode === "VIEW" ? "EDIT" : "VIEW"));
  };

  const handleSave = async (data: Partial<Lead>) => {
    setLocalIsLoading(true);
    try {
      const formattedData = {
        ...data,
        isOnlyChild: data.isOnlyChild ? "Oui" : "Non",
      };

      // Create originalLead with the same transformations for accurate comparison
      const originalLeadFormatted = {
        ...lead,
        isOnlyChild: lead.isOnlyChild === "Oui" ? true : false,
      };

      // Detect changes between formatted data and original formatted lead
      const changes = detectChanges(formattedData, originalLeadFormatted);

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
    const dateFields = [
      "giyusDate",
      "dateFinService",
      "birthDate",
      "dateInscription",
    ];

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

    // Helper function to format dates for display
    const formatValueForDisplay = (value: any, fieldName: string): string => {
      if (value === null || value === undefined) return "";

      // Check if it's a date field
      const dateFields = [
        "giyusDate",
        "dateFinService",
        "birthDate",
        "dateInscription",
      ];
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
      "firstName",
      "lastName",
      "city",
      "gender",
      "birthDate",
      "isOnlyChild",
      "contactUrgenceFirstName",
      "contactUrgenceLastName",
      "contactUrgencePhoneNumber",
      "contactUrgenceMail",
      "contactUrgenceRelation",
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
        title="Général"
        mode={mode}
        onModeChange={handleModeChange}
        onSave={handleSubmit(handleSave)}
        onCancel={handleCancel}
        isLoading={localIsLoading}
      >
        <FormSubSection title="Informations générales">
          <FormDatePicker
            control={control}
            name="dateInscription"
            label="Date d'inscription"
            mode={mode}
            readOnly={true}
            isLoading={localIsLoading}
          />
          <FormInput
            control={control}
            name="firstName"
            label="Prénom"
            mode={mode}
            isLoading={localIsLoading}
            readOnly={hasFieldPendingChanges("firstName")}
            pendingChange={hasFieldPendingChanges("firstName")}
            pendingChangeDetails={
              getPendingChangeDetails("firstName")
                ? {
                    oldValue: getPendingChangeDetails("firstName")!.oldValue,
                    newValue: getPendingChangeDetails("firstName")!.newValue,
                  }
                : undefined
            }
          />
          <FormInput
            control={control}
            name="lastName"
            label="Nom"
            mode={mode}
            isLoading={localIsLoading}
            readOnly={hasFieldPendingChanges("lastName")}
            pendingChange={hasFieldPendingChanges("lastName")}
            pendingChangeDetails={
              getPendingChangeDetails("lastName")
                ? {
                    oldValue: getPendingChangeDetails("lastName")!.oldValue,
                    newValue: getPendingChangeDetails("lastName")!.newValue,
                  }
                : undefined
            }
          />
          <FormInput
            control={control}
            name="city"
            label="Ville"
            mode={mode}
            isLoading={localIsLoading}
            readOnly={hasFieldPendingChanges("city")}
            pendingChange={hasFieldPendingChanges("city")}
            pendingChangeDetails={
              getPendingChangeDetails("city")
                ? {
                    oldValue: getPendingChangeDetails("city")!.oldValue,
                    newValue: getPendingChangeDetails("city")!.newValue,
                  }
                : undefined
            }
          />
          <FormDropdown
            control={control}
            name="gender"
            label="Genre"
            mode={mode}
            options={[
              { value: "Masculin", label: "Masculin" },
              { value: "Féminin", label: "Féminin" },
            ]}
            isLoading={localIsLoading}
            disabled={hasFieldPendingChanges("gender")}
            pendingChange={hasFieldPendingChanges("gender")}
            pendingChangeDetails={
              getPendingChangeDetails("gender")
                ? {
                    oldValue: getPendingChangeDetails("gender")!.oldValue,
                    newValue: getPendingChangeDetails("gender")!.newValue,
                  }
                : undefined
            }
          />
          <FormDatePicker
            control={control}
            name="birthDate"
            label="Date de naissance"
            mode={mode}
            isLoading={localIsLoading}
            readOnly={hasFieldPendingChanges("birthDate")}
            pendingChange={hasFieldPendingChanges("birthDate")}
            pendingChangeDetails={
              getPendingChangeDetails("birthDate")
                ? {
                    oldValue: getPendingChangeDetails("birthDate")!.oldValue,
                    newValue: getPendingChangeDetails("birthDate")!.newValue,
                  }
                : undefined
            }
          />
          <FormCheckbox
            control={control}
            name="isOnlyChild"
            label="Enfant unique"
            mode={mode}
            isLoading={localIsLoading}
            readOnly={hasFieldPendingChanges("isOnlyChild")}
            pendingChange={hasFieldPendingChanges("isOnlyChild")}
            pendingChangeDetails={
              getPendingChangeDetails("isOnlyChild")
                ? {
                    oldValue: getPendingChangeDetails("isOnlyChild")!.oldValue,
                    newValue: getPendingChangeDetails("isOnlyChild")!.newValue,
                  }
                : undefined
            }
          />
        </FormSubSection>

        <FormSubSection title="Contact d'urgence">
          <FormInput
            control={control}
            name="contactUrgenceFirstName"
            label="Prénom"
            mode={mode}
            isLoading={localIsLoading}
            readOnly={hasFieldPendingChanges("contactUrgenceFirstName")}
            pendingChange={hasFieldPendingChanges("contactUrgenceFirstName")}
            pendingChangeDetails={
              getPendingChangeDetails("contactUrgenceFirstName")
                ? {
                    oldValue: getPendingChangeDetails(
                      "contactUrgenceFirstName"
                    )!.oldValue,
                    newValue: getPendingChangeDetails(
                      "contactUrgenceFirstName"
                    )!.newValue,
                  }
                : undefined
            }
          />
          <FormInput
            control={control}
            name="contactUrgenceLastName"
            label="Nom"
            mode={mode}
            isLoading={localIsLoading}
            readOnly={hasFieldPendingChanges("contactUrgenceLastName")}
            pendingChange={hasFieldPendingChanges("contactUrgenceLastName")}
            pendingChangeDetails={
              getPendingChangeDetails("contactUrgenceLastName")
                ? {
                    oldValue: getPendingChangeDetails("contactUrgenceLastName")!
                      .oldValue,
                    newValue: getPendingChangeDetails("contactUrgenceLastName")!
                      .newValue,
                  }
                : undefined
            }
          />
          <FormInput
            control={control}
            name="contactUrgencePhoneNumber"
            label="Numéro de téléphone"
            mode={mode}
            isLoading={localIsLoading}
            readOnly={hasFieldPendingChanges("contactUrgencePhoneNumber")}
            pendingChange={hasFieldPendingChanges("contactUrgencePhoneNumber")}
            pendingChangeDetails={
              getPendingChangeDetails("contactUrgencePhoneNumber")
                ? {
                    oldValue: getPendingChangeDetails(
                      "contactUrgencePhoneNumber"
                    )!.oldValue,
                    newValue: getPendingChangeDetails(
                      "contactUrgencePhoneNumber"
                    )!.newValue,
                  }
                : undefined
            }
          />
          <FormInput
            control={control}
            name="contactUrgenceMail"
            label="Email"
            mode={mode}
            isLoading={localIsLoading}
            readOnly={hasFieldPendingChanges("contactUrgenceMail")}
            pendingChange={hasFieldPendingChanges("contactUrgenceMail")}
            pendingChangeDetails={
              getPendingChangeDetails("contactUrgenceMail")
                ? {
                    oldValue:
                      getPendingChangeDetails("contactUrgenceMail")!.oldValue,
                    newValue:
                      getPendingChangeDetails("contactUrgenceMail")!.newValue,
                  }
                : undefined
            }
          />
          <FormDropdown
            control={control}
            name="contactUrgenceRelation"
            label="Relation"
            mode={mode}
            options={RELATION.relation.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            isLoading={localIsLoading}
            disabled={hasFieldPendingChanges("contactUrgenceRelation")}
            pendingChange={hasFieldPendingChanges("contactUrgenceRelation")}
            pendingChangeDetails={
              getPendingChangeDetails("contactUrgenceRelation")
                ? {
                    oldValue: getPendingChangeDetails("contactUrgenceRelation")!
                      .oldValue,
                    newValue: getPendingChangeDetails("contactUrgenceRelation")!
                      .newValue,
                  }
                : undefined
            }
          />
        </FormSubSection>
      </FormSection>
    </form>
  );
};
