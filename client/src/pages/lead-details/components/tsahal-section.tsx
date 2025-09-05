import { useForm, useWatch } from "react-hook-form";
import { Lead } from "@/types/lead";
import {
  FormSection,
  FormSubSection,
} from "@/components/form-components/form-section";
import { FormDropdown } from "@/components/form-components/form-dropdown";
import { FormDatePicker } from "@/components/form-components/form-date-picker";
import { useState, useEffect } from "react";
import { MILITARY } from "@/i18n/military";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { updateLeadThunk } from "@/store/thunks/lead-details/lead-details.thunk";
import {
  createChangeRequestThunk,
  getChangeRequestsByLeadIdThunk,
} from "@/store/thunks/change-request/change-request.thunk";
import { toast } from "sonner";
import { processTsahalData } from "../setters/tsahal-setter";
import { useMahzorGiyus } from "@/hooks/use-mahzor-giyus";
import { useTypeGiyus } from "@/hooks/use-type-giyus";
import { useUserPermissions } from "@/hooks/use-user-permissions";
import { RoleType } from "@/types/role-types";
import { CreateChangeRequestDto, ChangeRequest } from "@/types/change-request";
import { useAuth0 } from "@auth0/auth0-react";

interface TsahalSectionProps {
  lead: Lead;
  changeRequestsByLead: ChangeRequest[];
}

export const TsahalSection = ({
  lead,
  changeRequestsByLead,
}: TsahalSectionProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth0();
  const { roleType } = useUserPermissions();

  const [mode, setMode] = useState<"EDIT" | "VIEW">("VIEW");
  const [localIsLoading, setLocalIsLoading] = useState(false);
  const { control, handleSubmit, reset } = useForm<Partial<Lead>>({
    defaultValues: {
      currentStatus: lead.currentStatus || "",
      soldierAloneStatus: lead.soldierAloneStatus || "",
      serviceType: lead.serviceType || "",
      mahalPath: lead.mahalPath || "",
      studyPath: lead.studyPath || "",
      tsavRishonStatus: lead.tsavRishonStatus || "",
      recruitmentCenter: lead.recruitmentCenter || "",
      tsavRishonDate: lead.tsavRishonDate || "",
      tsavRishonGradesReceived: lead.tsavRishonGradesReceived || "",
      daparNote: lead.daparNote || "",
      medicalProfile: lead.medicalProfile || "",
      hebrewScore: lead.hebrewScore || "",
      yomHameaStatus: lead.yomHameaStatus || "",
      yomHameaDate: lead.yomHameaDate || "",
      yomSayerotStatus: lead.yomSayerotStatus || "",
      yomSayerotDate: lead.yomSayerotDate || "",
      armyEntryDateStatus: lead.armyEntryDateStatus || "",
      giyusDate: lead.giyusDate || "",
      michveAlonTraining: lead.michveAlonTraining || "",
      mahzorGiyus: lead.mahzorGiyus || "",
    },
  });

  useEffect(() => {
    reset({
      currentStatus: lead.currentStatus || "",
      soldierAloneStatus: lead.soldierAloneStatus || "",
      serviceType: lead.serviceType || "",
      mahalPath: lead.mahalPath || "",
      studyPath: lead.studyPath || "",
      tsavRishonStatus: lead.tsavRishonStatus || "",
      recruitmentCenter: lead.recruitmentCenter || "",
      tsavRishonDate: lead.tsavRishonDate || "",
      tsavRishonGradesReceived: lead.tsavRishonGradesReceived || "",
      daparNote: lead.daparNote || "",
      medicalProfile: lead.medicalProfile || "",
      hebrewScore: lead.hebrewScore || "",
      yomHameaStatus: lead.yomHameaStatus || "",
      yomHameaDate: lead.yomHameaDate || "",
      yomSayerotStatus: lead.yomSayerotStatus || "",
      yomSayerotDate: lead.yomSayerotDate || "",
      armyEntryDateStatus: lead.armyEntryDateStatus || "",
      giyusDate: lead.giyusDate || "",
      michveAlonTraining: lead.michveAlonTraining || "",
      mahzorGiyus: lead.mahzorGiyus || "",
    });
  }, [lead, reset]);

  const serviceType = useWatch({
    control,
    name: "serviceType",
  });

  const tsavRishonStatus = useWatch({
    control,
    name: "tsavRishonStatus",
  });

  const tsavRishonGradesReceived = useWatch({
    control,
    name: "tsavRishonGradesReceived",
  });

  const yomHameaStatus = useWatch({
    control,
    name: "yomHameaStatus",
  });

  const yomSayerotStatus = useWatch({
    control,
    name: "yomSayerotStatus",
  });

  const armyEntryDateStatus = useWatch({
    control,
    name: "armyEntryDateStatus",
  });

  const giyusDate = useWatch({
    control,
    name: "giyusDate",
  });

  const mahalPath = useWatch({
    control,
    name: "mahalPath",
  });
  const currentStatus = useWatch({
    control,
    name: "currentStatus",
  });

  const mahzorGiyus = useMahzorGiyus(giyusDate);
  const typeGiyus = useTypeGiyus(
    giyusDate,
    mahalPath,
    currentStatus,
    serviceType
  );

  // Calculate original values for comparison (avoid using hooks in handleSave)
  const originalMahzorGiyus = useMahzorGiyus(lead.giyusDate);
  const originalTypeGiyus = useTypeGiyus(
    lead.giyusDate,
    lead.mahalPath,
    lead.currentStatus,
    lead.serviceType
  );

  const handleModeChange = () => {
    setMode((prevMode) => (prevMode === "VIEW" ? "EDIT" : "VIEW"));
  };

  const handleSave = async (data: Partial<Lead>) => {
    setLocalIsLoading(true);
    try {
      // Apply the same transformations as before
      const processedData = processTsahalData(data, mahzorGiyus, typeGiyus);

      // Create originalLead with the same transformations for accurate comparison
      const originalLeadFormatted = processTsahalData(
        lead,
        originalMahzorGiyus,
        originalTypeGiyus
      ) as Partial<Lead>;

      // Detect changes between processed data and original processed lead
      const changes = detectChanges(
        processedData as Partial<Lead>,
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
      "tsavRishonDate",
      "yomHameaDate",
      "yomSayerotDate",
      "giyusDate",
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
      const dateFields = [
        "tsavRishonDate",
        "yomHameaDate",
        "yomSayerotDate",
        "giyusDate",
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
      "currentStatus",
      "soldierAloneStatus",
      "serviceType",
      "mahalPath",
      "studyPath",
      "tsavRishonStatus",
      "recruitmentCenter",
      "tsavRishonDate",
      "tsavRishonGradesReceived",
      "daparNote",
      "medicalProfile",
      "hebrewScore",
      "yomHameaStatus",
      "yomHameaDate",
      "yomSayerotStatus",
      "yomSayerotDate",
      "armyEntryDateStatus",
      "giyusDate",
      "michveAlonTraining",
      "mahzorGiyus",
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
        title="Historique militaire"
        mode={mode}
        onModeChange={handleModeChange}
        onSave={handleSubmit(handleSave)}
        onCancel={handleCancel}
        isLoading={localIsLoading}
      >
        <FormSubSection>
          <FormDropdown
            control={control}
            name="soldierAloneStatus"
            label="Soldat seul"
            mode={mode}
            options={MILITARY.is_lone_solider.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            isLoading={localIsLoading}
            disabled={hasFieldPendingChanges("soldierAloneStatus")}
            pendingChange={hasFieldPendingChanges("soldierAloneStatus")}
            pendingChangeDetails={
              getPendingChangeDetails("soldierAloneStatus")
                ? {
                    oldValue:
                      getPendingChangeDetails("soldierAloneStatus")!.oldValue,
                    newValue:
                      getPendingChangeDetails("soldierAloneStatus")!.newValue,
                  }
                : undefined
            }
          />
          <FormDropdown
            control={control}
            name="serviceType"
            label="Type de service"
            mode={mode}
            options={MILITARY.service_type.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            isLoading={localIsLoading}
            disabled={hasFieldPendingChanges("serviceType")}
            pendingChange={hasFieldPendingChanges("serviceType")}
            pendingChangeDetails={
              getPendingChangeDetails("serviceType")
                ? {
                    oldValue: getPendingChangeDetails("serviceType")!.oldValue,
                    newValue: getPendingChangeDetails("serviceType")!.newValue,
                  }
                : undefined
            }
          />
          <FormDropdown
            control={control}
            name="mahalPath"
            label="Parcours Mahal"
            mode={mode}
            options={MILITARY.mahal_type.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            hidden={serviceType !== "Mahal"}
            isLoading={localIsLoading}
            disabled={hasFieldPendingChanges("mahalPath")}
            pendingChange={hasFieldPendingChanges("mahalPath")}
            pendingChangeDetails={
              getPendingChangeDetails("mahalPath")
                ? {
                    oldValue: getPendingChangeDetails("mahalPath")!.oldValue,
                    newValue: getPendingChangeDetails("mahalPath")!.newValue,
                  }
                : undefined
            }
          />
          <FormDropdown
            control={control}
            name="studyPath"
            label="Parcours d'études"
            mode={mode}
            options={MILITARY.study_type.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            hidden={serviceType !== "Études"}
            isLoading={localIsLoading}
            disabled={hasFieldPendingChanges("studyPath")}
            pendingChange={hasFieldPendingChanges("studyPath")}
            pendingChangeDetails={
              getPendingChangeDetails("studyPath")
                ? {
                    oldValue: getPendingChangeDetails("studyPath")!.oldValue,
                    newValue: getPendingChangeDetails("studyPath")!.newValue,
                  }
                : undefined
            }
          />
          <FormDropdown
            control={control}
            name="tsavRishonStatus"
            label="Convocation Tsav Rishon"
            mode={mode}
            options={MILITARY.has_received_tsav_rishon.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            isLoading={localIsLoading}
            disabled={hasFieldPendingChanges("tsavRishonStatus")}
            pendingChange={hasFieldPendingChanges("tsavRishonStatus")}
            pendingChangeDetails={
              getPendingChangeDetails("tsavRishonStatus")
                ? {
                    oldValue:
                      getPendingChangeDetails("tsavRishonStatus")!.oldValue,
                    newValue:
                      getPendingChangeDetails("tsavRishonStatus")!.newValue,
                  }
                : undefined
            }
          />
          <FormDropdown
            control={control}
            name="recruitmentCenter"
            label="Centre de recrutement"
            mode={mode}
            options={MILITARY.recruitment_center_tsav_rishon.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            hidden={tsavRishonStatus !== "Oui"}
            isLoading={localIsLoading}
            disabled={hasFieldPendingChanges("recruitmentCenter")}
            pendingChange={hasFieldPendingChanges("recruitmentCenter")}
            pendingChangeDetails={
              getPendingChangeDetails("recruitmentCenter")
                ? {
                    oldValue:
                      getPendingChangeDetails("recruitmentCenter")!.oldValue,
                    newValue:
                      getPendingChangeDetails("recruitmentCenter")!.newValue,
                  }
                : undefined
            }
          />
          <FormDatePicker
            control={control}
            name="tsavRishonDate"
            label="Date Tsav Rishon"
            mode={mode}
            hidden={tsavRishonStatus !== "Oui"}
            isLoading={localIsLoading}
            readOnly={hasFieldPendingChanges("tsavRishonDate")}
            pendingChange={hasFieldPendingChanges("tsavRishonDate")}
            pendingChangeDetails={
              getPendingChangeDetails("tsavRishonDate")
                ? {
                    oldValue:
                      getPendingChangeDetails("tsavRishonDate")!.oldValue,
                    newValue:
                      getPendingChangeDetails("tsavRishonDate")!.newValue,
                  }
                : undefined
            }
          />
          <FormDropdown
            control={control}
            name="tsavRishonGradesReceived"
            label="Notes Tsav Rishon"
            mode={mode}
            options={MILITARY.has_received_tsav_rishon_grade.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            hidden={tsavRishonStatus !== "Oui"}
            isLoading={localIsLoading}
            disabled={hasFieldPendingChanges("tsavRishonGradesReceived")}
            pendingChange={hasFieldPendingChanges("tsavRishonGradesReceived")}
            pendingChangeDetails={
              getPendingChangeDetails("tsavRishonGradesReceived")
                ? {
                    oldValue: getPendingChangeDetails(
                      "tsavRishonGradesReceived"
                    )!.oldValue,
                    newValue: getPendingChangeDetails(
                      "tsavRishonGradesReceived"
                    )!.newValue,
                  }
                : undefined
            }
          />
          <FormDropdown
            control={control}
            name="daparNote"
            label="Note Dapar"
            mode={mode}
            options={MILITARY.dapar_grades.map((option) => ({
              value: option.value.toString(),
              label: option.displayName,
            }))}
            hidden={tsavRishonGradesReceived !== "Oui"}
            isLoading={localIsLoading}
            disabled={hasFieldPendingChanges("daparNote")}
            pendingChange={hasFieldPendingChanges("daparNote")}
            pendingChangeDetails={
              getPendingChangeDetails("daparNote")
                ? {
                    oldValue: getPendingChangeDetails("daparNote")!.oldValue,
                    newValue: getPendingChangeDetails("daparNote")!.newValue,
                  }
                : undefined
            }
          />
          <FormDropdown
            control={control}
            name="medicalProfile"
            label="Profil médical"
            mode={mode}
            options={MILITARY.medical_profile.map((option) => ({
              value: option.value.toString(),
              label: option.displayName,
            }))}
            hidden={tsavRishonGradesReceived !== "Oui"}
            isLoading={localIsLoading}
            disabled={hasFieldPendingChanges("medicalProfile")}
            pendingChange={hasFieldPendingChanges("medicalProfile")}
            pendingChangeDetails={
              getPendingChangeDetails("medicalProfile")
                ? {
                    oldValue:
                      getPendingChangeDetails("medicalProfile")!.oldValue,
                    newValue:
                      getPendingChangeDetails("medicalProfile")!.newValue,
                  }
                : undefined
            }
          />
          <FormDropdown
            control={control}
            name="hebrewScore"
            label="Simoul Ivrit"
            mode={mode}
            options={MILITARY.hebrew_grade.map((option) => ({
              value: option.value.toString(),
              label: option.displayName,
            }))}
            hidden={tsavRishonGradesReceived !== "Oui"}
            isLoading={localIsLoading}
            disabled={hasFieldPendingChanges("hebrewScore")}
            pendingChange={hasFieldPendingChanges("hebrewScore")}
            pendingChangeDetails={
              getPendingChangeDetails("hebrewScore")
                ? {
                    oldValue: getPendingChangeDetails("hebrewScore")!.oldValue,
                    newValue: getPendingChangeDetails("hebrewScore")!.newValue,
                  }
                : undefined
            }
          />
          <FormDropdown
            control={control}
            name="yomHameaStatus"
            label="Yom Hamea"
            mode={mode}
            options={MILITARY.has_received_yom_hameah.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            isLoading={localIsLoading}
            disabled={hasFieldPendingChanges("yomHameaStatus")}
            pendingChange={hasFieldPendingChanges("yomHameaStatus")}
            pendingChangeDetails={
              getPendingChangeDetails("yomHameaStatus")
                ? {
                    oldValue:
                      getPendingChangeDetails("yomHameaStatus")!.oldValue,
                    newValue:
                      getPendingChangeDetails("yomHameaStatus")!.newValue,
                  }
                : undefined
            }
          />
          <FormDatePicker
            control={control}
            name="yomHameaDate"
            label="Date Yom Hamea"
            mode={mode}
            hidden={yomHameaStatus !== "Oui"}
            isLoading={localIsLoading}
            readOnly={hasFieldPendingChanges("yomHameaDate")}
            pendingChange={hasFieldPendingChanges("yomHameaDate")}
            pendingChangeDetails={
              getPendingChangeDetails("yomHameaDate")
                ? {
                    oldValue: getPendingChangeDetails("yomHameaDate")!.oldValue,
                    newValue: getPendingChangeDetails("yomHameaDate")!.newValue,
                  }
                : undefined
            }
          />
          <FormDropdown
            control={control}
            name="yomSayerotStatus"
            label="Yom Sayerot"
            mode={mode}
            options={MILITARY.has_received_yom_sayerot.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            isLoading={localIsLoading}
            disabled={hasFieldPendingChanges("yomSayerotStatus")}
            pendingChange={hasFieldPendingChanges("yomSayerotStatus")}
            pendingChangeDetails={
              getPendingChangeDetails("yomSayerotStatus")
                ? {
                    oldValue:
                      getPendingChangeDetails("yomSayerotStatus")!.oldValue,
                    newValue:
                      getPendingChangeDetails("yomSayerotStatus")!.newValue,
                  }
                : undefined
            }
          />
          <FormDatePicker
            control={control}
            name="yomSayerotDate"
            label="Date Yom Sayerot"
            mode={mode}
            hidden={yomSayerotStatus !== "Oui"}
            isLoading={localIsLoading}
            readOnly={hasFieldPendingChanges("yomSayerotDate")}
            pendingChange={hasFieldPendingChanges("yomSayerotDate")}
            pendingChangeDetails={
              getPendingChangeDetails("yomSayerotDate")
                ? {
                    oldValue:
                      getPendingChangeDetails("yomSayerotDate")!.oldValue,
                    newValue:
                      getPendingChangeDetails("yomSayerotDate")!.newValue,
                  }
                : undefined
            }
          />
          <FormDropdown
            control={control}
            name="armyEntryDateStatus"
            label="Date d'entrée dans l'armée"
            mode={mode}
            options={MILITARY.has_received_giyus_date.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            isLoading={localIsLoading}
            disabled={hasFieldPendingChanges("armyEntryDateStatus")}
            pendingChange={hasFieldPendingChanges("armyEntryDateStatus")}
            pendingChangeDetails={
              getPendingChangeDetails("armyEntryDateStatus")
                ? {
                    oldValue: getPendingChangeDetails("armyEntryDateStatus")!
                      .oldValue,
                    newValue: getPendingChangeDetails("armyEntryDateStatus")!
                      .newValue,
                  }
                : undefined
            }
          />
          <FormDatePicker
            control={control}
            name="giyusDate"
            label="Date Giyus"
            mode={mode}
            hidden={armyEntryDateStatus !== "Oui"}
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
            name="michveAlonTraining"
            label="Michve Alon"
            mode={mode}
            options={MILITARY.program_at_michve_alon.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            hidden={armyEntryDateStatus !== "Oui"}
            isLoading={localIsLoading}
            disabled={hasFieldPendingChanges("michveAlonTraining")}
            pendingChange={hasFieldPendingChanges("michveAlonTraining")}
            pendingChangeDetails={
              getPendingChangeDetails("michveAlonTraining")
                ? {
                    oldValue:
                      getPendingChangeDetails("michveAlonTraining")!.oldValue,
                    newValue:
                      getPendingChangeDetails("michveAlonTraining")!.newValue,
                  }
                : undefined
            }
          />
        </FormSubSection>
      </FormSection>
    </form>
  );
};
