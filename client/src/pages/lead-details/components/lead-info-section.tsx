import { useForm } from "react-hook-form";
import { Lead } from "@/types/lead";
import { FormInput } from "@/components/form-components/form-input";
import {
  FormSection,
  FormSubSection,
} from "@/components/form-components/form-section";
import { FormDropdown } from "@/components/form-components/form-dropdown";
import { FormDatePicker } from "@/components/form-components/form-date-picker";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { updateLeadThunk } from "@/store/thunks/lead-details/lead-details.thunk";
import {
  createChangeRequestThunk,
  getChangeRequestsByLeadIdThunk,
} from "@/store/thunks/change-request/change-request.thunk";
import { toast } from "sonner";
import { CURRENT_STATUS } from "@/i18n/current-status";
import { STATUS_CANDIDAT } from "@/i18n/status-candidat";
import { TYPE_GIYUS } from "@/i18n/type-giyus";
import { PIKOUD } from "@/i18n/pikoud";
import { useMahzorGiyus } from "@/hooks/use-mahzor-giyus";
import { useTypeGiyus } from "@/hooks/use-type-giyus";
import { useExpertCoBadge } from "@/hooks/use-expert-co-badge";
import { useUserPermissions } from "@/hooks/use-user-permissions";
import { TYPE_POSTE } from "@/i18n/type-poste";
import { RoleType } from "@/types/role-types";
import { CreateChangeRequestDto } from "@/types/change-request";
import { useAuth0 } from "@auth0/auth0-react";

interface LeadInfoSectionProps {
  lead: Lead;
}

export const LeadInfoSection = ({ lead }: LeadInfoSectionProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth0();
  const { roleType } = useUserPermissions();
  const { changeRequestsByLead } = useSelector(
    (state: RootState) => state.changeRequest
  );

  const [mode, setMode] = useState<"EDIT" | "VIEW">("VIEW");
  const [localIsLoading, setLocalIsLoading] = useState(false);
  const { control, handleSubmit, reset, watch } = useForm<Partial<Lead>>({
    defaultValues: {
      firstName: lead.firstName,
      lastName: lead.lastName,
      statutCandidat: lead.statutCandidat,
      currentStatus: lead.currentStatus,
      phoneNumber: lead.phoneNumber,
      whatsappNumber: lead.whatsappNumber,
      email: lead.email,
      mahzorGiyus: lead.mahzorGiyus,
      typePoste: lead.typePoste,
      soldierAloneStatus: lead.soldierAloneStatus,
      giyusDate: lead.giyusDate,
      typeGiyus: lead.typeGiyus,
      nomPoste: lead.nomPoste,
      pikoud: lead.pikoud,
      dateFinService: lead.dateFinService,
      mahalPath: lead.mahalPath,
      serviceType: lead.serviceType,
      armyEntryDateStatus: lead.armyEntryDateStatus,
    },
  });

  const giyusDate = watch("giyusDate");
  const mahalPath = watch("mahalPath");
  const currentStatus = watch("currentStatus");
  const serviceType = watch("serviceType");
  const statutCandidat = watch("statutCandidat");

  const mahzorGiyus = useMahzorGiyus(giyusDate);
  const typeGiyus = useTypeGiyus(
    giyusDate,
    mahalPath,
    currentStatus,
    serviceType
  );

  const expertCoBadge = useExpertCoBadge({
    expertConnection: lead.expertConnection,
    produitEC1: lead.produitEC1,
    produitEC2: lead.produitEC2,
    produitEC3: lead.produitEC3,
    produitEC4: lead.produitEC4,
    produitEC5: lead.produitEC5,
  });

  // Logic to determine currentStatus options and disabled state
  const getCurrentStatusConfig = () => {
    switch (statutCandidat) {
      case "À traiter":
      case "En cours de traitement":
        return {
          options: CURRENT_STATUS.all_status,
          disabled: false,
        };
      case "Dossier traité":
        return {
          options: CURRENT_STATUS.internal_status,
          disabled: false,
        };
      case "Ne répond pas / Ne sait pas":
      case "Pas de notre ressort":
        return {
          options: [],
          disabled: true,
        };
      default:
        return {
          options: CURRENT_STATUS.all_status,
          disabled: false,
        };
    }
  };

  const currentStatusConfig = getCurrentStatusConfig();

  useEffect(() => {
    reset({
      firstName: lead.firstName,
      lastName: lead.lastName,
      statutCandidat: lead.statutCandidat,
      currentStatus: lead.currentStatus,
      phoneNumber: lead.phoneNumber,
      whatsappNumber: lead.whatsappNumber,
      email: lead.email,
      mahzorGiyus: lead.mahzorGiyus,
      typePoste: lead.typePoste,
      soldierAloneStatus: lead.soldierAloneStatus,
      giyusDate: lead.giyusDate,
      typeGiyus: lead.typeGiyus,
      nomPoste: lead.nomPoste,
      pikoud: lead.pikoud,
      dateFinService: lead.dateFinService,
      mahalPath: lead.mahalPath,
      serviceType: lead.serviceType,
      armyEntryDateStatus: lead.armyEntryDateStatus,
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
      // Apply the same transformations as before
      const formattedData = {
        ...data,
        mahzorGiyus: mahzorGiyus,
        // Use form value for typeGiyus (user can override the calculated value)
        typeGiyus: data.typeGiyus,
        armyEntryDateStatus: data.giyusDate ? "Oui" : "Non",
      };

      if (
        data.statutCandidat === "Ne répond pas / Ne sait pas" ||
        data.statutCandidat === "Pas de notre ressort"
      ) {
        formattedData.currentStatus = "";
      }

      // Create originalLead with the same transformations for accurate comparison
      const originalLeadFormatted = {
        ...lead,
        armyEntryDateStatus: lead.giyusDate ? "Oui" : "Non",
        currentStatus:
          lead.statutCandidat === "Ne répond pas / Ne sait pas" ||
          lead.statutCandidat === "Pas de notre ressort"
            ? ""
            : lead.currentStatus,
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

    // Check for changes in each field
    const fieldsToCheck = [
      "firstName",
      "lastName",
      "statutCandidat",
      "currentStatus",
      "phoneNumber",
      "whatsappNumber",
      "email",
      "mahzorGiyus",
      "typePoste",
      "soldierAloneStatus",
      "giyusDate",
      "typeGiyus",
      "nomPoste",
      "pikoud",
      "dateFinService",
      "mahalPath",
      "serviceType",
      "armyEntryDateStatus",
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
        title={
          <div className="flex items-center gap-2">
            {lead.firstName + " " + lead.lastName}
            {expertCoBadge}
          </div>
        }
        mode={mode}
        onModeChange={handleModeChange}
        onSave={handleSubmit(handleSave)}
        onCancel={handleCancel}
        isLoading={localIsLoading}
      >
        <FormSubSection>
          <FormDropdown
            control={control}
            name="statutCandidat"
            label="Statut candidat"
            mode={mode}
            isLoading={localIsLoading}
            disabled={hasFieldPendingChanges("statutCandidat")}
            pendingChange={hasFieldPendingChanges("statutCandidat")}
            pendingChangeDetails={
              getPendingChangeDetails("statutCandidat")
                ? {
                    oldValue:
                      getPendingChangeDetails("statutCandidat")!.oldValue,
                    newValue:
                      getPendingChangeDetails("statutCandidat")!.newValue,
                  }
                : undefined
            }
            options={STATUS_CANDIDAT.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
          />

          <FormDropdown
            control={control}
            name="currentStatus"
            label="Situation actuelle"
            mode={mode}
            isLoading={localIsLoading}
            options={currentStatusConfig.options.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            disabled={
              currentStatusConfig.disabled ||
              hasFieldPendingChanges("currentStatus")
            }
            pendingChange={hasFieldPendingChanges("currentStatus")}
            pendingChangeDetails={
              getPendingChangeDetails("currentStatus")
                ? {
                    oldValue:
                      getPendingChangeDetails("currentStatus")!.oldValue,
                    newValue:
                      getPendingChangeDetails("currentStatus")!.newValue,
                  }
                : undefined
            }
          />

          <FormInput
            control={control}
            name="phoneNumber"
            label="Téléphone"
            mode={mode}
            isLoading={localIsLoading}
            readOnly={hasFieldPendingChanges("phoneNumber")}
            pendingChange={hasFieldPendingChanges("phoneNumber")}
            pendingChangeDetails={
              getPendingChangeDetails("phoneNumber")
                ? {
                    oldValue: getPendingChangeDetails("phoneNumber")!.oldValue,
                    newValue: getPendingChangeDetails("phoneNumber")!.newValue,
                  }
                : undefined
            }
          />

          <FormInput
            control={control}
            name="whatsappNumber"
            label="Whatsapp"
            mode={mode}
            isLoading={localIsLoading}
            readOnly={hasFieldPendingChanges("whatsappNumber")}
            pendingChange={hasFieldPendingChanges("whatsappNumber")}
            pendingChangeDetails={
              getPendingChangeDetails("whatsappNumber")
                ? {
                    oldValue:
                      getPendingChangeDetails("whatsappNumber")!.oldValue,
                    newValue:
                      getPendingChangeDetails("whatsappNumber")!.newValue,
                  }
                : undefined
            }
            hidden={
              mode === "VIEW" &&
              !lead.whatsappNumber &&
              !hasFieldPendingChanges("whatsappNumber")
            }
          />

          <FormInput
            control={control}
            name="email"
            label="Email"
            mode={mode}
            isLoading={localIsLoading}
            readOnly={hasFieldPendingChanges("email")}
            pendingChange={hasFieldPendingChanges("email")}
            pendingChangeDetails={
              getPendingChangeDetails("email")
                ? {
                    oldValue: getPendingChangeDetails("email")!.oldValue,
                    newValue: getPendingChangeDetails("email")!.newValue,
                  }
                : undefined
            }
          />
          <FormInput
            control={control}
            name="mahzorGiyus"
            label="Mahzor Giyus"
            mode={mode}
            isLoading={localIsLoading}
            readOnly={true}
          />

          <FormDatePicker
            control={control}
            name="giyusDate"
            label="Date Giyus"
            mode={mode}
            isLoading={localIsLoading}
            readOnly={hasFieldPendingChanges("giyusDate")}
            pendingChange={hasFieldPendingChanges("giyusDate")}
            pendingChangeDetails={
              getPendingChangeDetails("giyusDate")
                ? {
                    oldValue: getPendingChangeDetails("giyusDate")!.oldValue,
                    newValue: getPendingChangeDetails("giyusDate")!.newValue,
                  }
                : undefined
            }
          />

          <FormDropdown
            control={control}
            name="typeGiyus"
            label="Type Giyus"
            mode={mode}
            isLoading={localIsLoading}
            disabled={hasFieldPendingChanges("typeGiyus")}
            pendingChange={hasFieldPendingChanges("typeGiyus")}
            pendingChangeDetails={
              getPendingChangeDetails("typeGiyus")
                ? {
                    oldValue: getPendingChangeDetails("typeGiyus")!.oldValue,
                    newValue: getPendingChangeDetails("typeGiyus")!.newValue,
                  }
                : undefined
            }
            options={TYPE_GIYUS.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
          />

          <FormDropdown
            control={control}
            name="typePoste"
            label="Type de poste"
            mode={mode}
            isLoading={localIsLoading}
            disabled={hasFieldPendingChanges("typePoste")}
            pendingChange={hasFieldPendingChanges("typePoste")}
            pendingChangeDetails={
              getPendingChangeDetails("typePoste")
                ? {
                    oldValue: getPendingChangeDetails("typePoste")!.oldValue,
                    newValue: getPendingChangeDetails("typePoste")!.newValue,
                  }
                : undefined
            }
            options={TYPE_POSTE.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
          />

          <FormInput
            control={control}
            name="nomPoste"
            label="Nom du poste"
            mode={mode}
            isLoading={localIsLoading}
            readOnly={hasFieldPendingChanges("nomPoste")}
            pendingChange={hasFieldPendingChanges("nomPoste")}
            pendingChangeDetails={
              getPendingChangeDetails("nomPoste")
                ? {
                    oldValue: getPendingChangeDetails("nomPoste")!.oldValue,
                    newValue: getPendingChangeDetails("nomPoste")!.newValue,
                  }
                : undefined
            }
          />

          <FormDropdown
            control={control}
            name="pikoud"
            label="Pikoud"
            mode={mode}
            isLoading={localIsLoading}
            disabled={hasFieldPendingChanges("pikoud")}
            pendingChange={hasFieldPendingChanges("pikoud")}
            pendingChangeDetails={
              getPendingChangeDetails("pikoud")
                ? {
                    oldValue: getPendingChangeDetails("pikoud")!.oldValue,
                    newValue: getPendingChangeDetails("pikoud")!.newValue,
                  }
                : undefined
            }
            options={PIKOUD.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
          />

          <FormDatePicker
            control={control}
            name="dateFinService"
            label="Date de fin de service"
            mode={mode}
            isLoading={localIsLoading}
            readOnly={hasFieldPendingChanges("dateFinService")}
            pendingChange={hasFieldPendingChanges("dateFinService")}
            pendingChangeDetails={
              getPendingChangeDetails("dateFinService")
                ? {
                    oldValue:
                      getPendingChangeDetails("dateFinService")!.oldValue,
                    newValue:
                      getPendingChangeDetails("dateFinService")!.newValue,
                  }
                : undefined
            }
          />
        </FormSubSection>
      </FormSection>
    </form>
  );
};
