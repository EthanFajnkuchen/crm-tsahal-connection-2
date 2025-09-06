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
import { useFormBase } from "./use-form-base";

interface UseFormOptions {
  lead: Lead;
  changeRequestsByLead?: ChangeRequest[];
  fieldsToCheck: string[];
  dateFields?: string[];
  dataProcessor?: (data: any) => any;
}

/**
 * Unified form hook that handles both volunteer and admin behaviors
 * based on the user's role
 */
export const useForm = (options: UseFormOptions) => {
  const { lead, changeRequestsByLead = [] } = options;
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth0();
  const { roleType, isLoading } = useUserPermissions();

  const baseForm = useFormBase({
    fieldsToCheck: options.fieldsToCheck,
    dateFields: options.dateFields,
  });

  const { setLocalIsLoading, setMode, formatDateForDisplay, detectChanges } =
    baseForm;

  const userRole = roleType[0];
  const isVolunteer = userRole === RoleType.VOLONTAIRE;
  const isAdmin = userRole === RoleType.ADMINISTRATEUR;

  // If still loading permissions, return a loading state
  if (isLoading) {
    return {
      ...baseForm,
      localIsLoading: true,
      roleType: [],
      handleSave: async () => {},
      getFieldProps: () => ({
        disabled: true,
        readOnly: true,
        pendingChange: false,
        pendingChangeDetails: undefined,
      }),
      hasFieldPendingChanges: () => false,
      getPendingChangeDetails: () => null,
      createChangeRequests: async () => {},
      isAdmin: false,
      isVolunteer: false,
    };
  }

  // Volunteer-specific functions
  const hasFieldPendingChanges = (fieldName: string): boolean => {
    if (!isVolunteer) return false;
    return changeRequestsByLead.some(
      (request) => request.fieldChanged === fieldName
    );
  };

  const getPendingChangeDetails = (fieldName: string) => {
    if (!isVolunteer) return null;
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

  const detectChangesForVolunteer = (
    formData: Partial<Lead>,
    originalLead: Partial<Lead>
  ) => {
    const baseChanges = detectChanges(formData, originalLead);
    return baseChanges.filter(
      (change) => !hasFieldPendingChanges(change.fieldChanged)
    );
  };

  const createChangeRequests = async (changes: any[]) => {
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
    await dispatch(getChangeRequestsByLeadIdThunk(lead.ID));
  };

  // Main save handler - adapts behavior based on role
  const handleSave = async (
    data: Partial<Lead>,
    reset: () => void,
    originalData?: Partial<Lead>
  ) => {
    if (!isVolunteer && !isAdmin) {
      toast.error("Accès non autorisé pour cette action");
      return;
    }

    setLocalIsLoading(true);
    try {
      const { dataProcessor } = options;
      const processedData = dataProcessor ? dataProcessor(data) : data;
      const originalLeadFormatted = dataProcessor
        ? dataProcessor(originalData || lead)
        : originalData || lead;

      if (isVolunteer) {
        // Volunteer behavior: create change requests
        const changes = detectChangesForVolunteer(
          processedData as Partial<Lead>,
          originalLeadFormatted as Partial<Lead>
        );

        if (changes.length > 0) {
          await createChangeRequests(changes);
          reset();
          toast.success(
            `${changes.length} demande(s) de modification envoyée(s) pour approbation`
          );
        } else {
          toast.info("Aucun changement détecté");
        }
      } else if (isAdmin) {
        // Admin behavior: update directly
        await dispatch(
          updateLeadThunk({
            id: lead.ID.toString(),
            updateData: processedData,
          })
        ).unwrap();

        reset();
        toast.success("Le lead a été modifié avec succès");
      }

      setMode("VIEW");
    } catch (error) {
      console.error("Failed to save changes:", error);
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setLocalIsLoading(false);
    }
  };

  // Get field props - adapts behavior based on role
  const getFieldProps = (fieldName: string) => {
    if (isVolunteer) {
      const isPendingChanges = hasFieldPendingChanges(fieldName);
      const pendingDetails = getPendingChangeDetails(fieldName);

      return {
        disabled: isPendingChanges,
        readOnly: isPendingChanges,
        pendingChange: isPendingChanges,
        pendingChangeDetails: pendingDetails
          ? {
              oldValue: pendingDetails.oldValue,
              newValue: pendingDetails.newValue,
            }
          : undefined,
      };
    } else {
      // Admin can edit all fields
      return {
        disabled: false,
        readOnly: false,
        pendingChange: false,
        pendingChangeDetails: undefined,
      };
    }
  };

  return {
    ...baseForm,
    roleType,
    handleSave,
    hasFieldPendingChanges,
    getPendingChangeDetails,
    getFieldProps,
    createChangeRequests,
    isVolunteer,
    isAdmin,
  };
};
