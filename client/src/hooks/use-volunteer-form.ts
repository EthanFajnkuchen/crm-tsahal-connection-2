import { useState } from "react";
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
import { Lead } from "@/types/lead";

interface UseVolunteerFormOptions {
  lead: Lead;
  changeRequestsByLead: ChangeRequest[];
  fieldsToCheck: string[];
  dateFields?: string[];
  dataProcessor?: (data: any) => any;
}

interface ChangeDetectionResult {
  fieldChanged: string;
  oldValue: string;
  newValue: string;
}

export const useVolunteerForm = ({
  lead,
  changeRequestsByLead,
  fieldsToCheck,
  dateFields = [],
  dataProcessor,
}: UseVolunteerFormOptions) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth0();
  const { roleType } = useUserPermissions();

  const [mode, setMode] = useState<"EDIT" | "VIEW">("VIEW");
  const [localIsLoading, setLocalIsLoading] = useState(false);

  // Helper function to safely convert values to strings
  const toString = (value: any): string => {
    if (value === null || value === undefined) return "";
    return String(value);
  };

  // Helper function to format dates for display
  const formatDateForDisplay = (value: string, fieldName: string): string => {
    if (!value) return value;

    if (dateFields.includes(fieldName)) {
      const dateValue = new Date(value);
      if (!isNaN(dateValue.getTime())) {
        return dateValue.toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      }
    }

    return value;
  };

  // Helper function to format values for display in change requests
  const formatValueForDisplay = (value: any, fieldName: string): string => {
    if (value === null || value === undefined) return "";

    if (dateFields.includes(fieldName)) {
      const dateValue = new Date(value);
      if (!isNaN(dateValue.getTime())) {
        return dateValue.toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      }
    }

    return String(value);
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

    if (pendingChange) {
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
  ): ChangeDetectionResult[] => {
    const changes: ChangeDetectionResult[] = [];

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
  const createChangeRequests = async (changes: ChangeDetectionResult[]) => {
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

  // Main save handler
  const handleSave = async (
    data: Partial<Lead>,
    reset: () => void,
    originalData?: Partial<Lead>
  ) => {
    setLocalIsLoading(true);
    try {
      // Apply data processor if provided
      const processedData = dataProcessor ? dataProcessor(data) : data;

      // Create original lead with same transformations for accurate comparison
      const originalLeadFormatted = dataProcessor
        ? dataProcessor(originalData || lead)
        : originalData || lead;

      // Detect changes between processed data and original processed lead
      const changes = detectChanges(
        processedData as Partial<Lead>,
        originalLeadFormatted as Partial<Lead>
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
            updateData: processedData,
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

  const handleModeChange = () => {
    setMode((prevMode) => (prevMode === "VIEW" ? "EDIT" : "VIEW"));
  };

  const handleCancel = (reset: () => void) => {
    reset();
    setMode("VIEW");
  };

  // Get field props for form components
  const getFieldProps = (fieldName: string) => {
    const isPendingChanges = hasFieldPendingChanges(fieldName);
    const pendingDetails = getPendingChangeDetails(fieldName);

    return {
      disabled: isPendingChanges, // For dropdowns
      readOnly: isPendingChanges, // For inputs
      pendingChange: isPendingChanges,
      pendingChangeDetails: pendingDetails
        ? {
            oldValue: pendingDetails.oldValue,
            newValue: pendingDetails.newValue,
          }
        : undefined,
    };
  };

  return {
    mode,
    localIsLoading,
    roleType,
    handleSave,
    handleModeChange,
    handleCancel,
    hasFieldPendingChanges,
    getPendingChangeDetails,
    getFieldProps,
    detectChanges,
    createChangeRequests,
  };
};
