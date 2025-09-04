import { useForm, useWatch } from "react-hook-form";
import { Lead } from "@/types/lead";
import { FormInput } from "@/components/form-components/form-input";
import {
  FormSection,
  FormSubSection,
} from "@/components/form-components/form-section";
import { FormDropdown } from "@/components/form-components/form-dropdown";
import { useState, useEffect } from "react";
import { EDUCATION } from "@/i18n/education";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { updateLeadThunk } from "@/store/thunks/lead-details/lead-details.thunk";
import {
  createChangeRequestThunk,
  getChangeRequestsByLeadIdThunk,
} from "@/store/thunks/change-request/change-request.thunk";
import { toast } from "sonner";
import { processEducationData } from "../setters/education-setter";
import { useUserPermissions } from "@/hooks/use-user-permissions";
import { RoleType } from "@/types/role-types";
import { CreateChangeRequestDto } from "@/types/change-request";
import { useAuth0 } from "@auth0/auth0-react";

interface EducationSectionProps {
  lead: Lead;
}

export const EducationSection = ({ lead }: EducationSectionProps) => {
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
      bacObtention: lead.bacObtention || "",
      bacCountry: lead.bacCountry || "",
      bacType: lead.bacType || "",
      israeliBacSchool: lead.israeliBacSchool || "",
      frenchBacSchoolIsrael: lead.frenchBacSchoolIsrael || "",
      otherSchoolName: lead.otherSchoolName || "",
      jewishSchool: lead.jewishSchool || "",
      frenchBacSchoolFrance: lead.frenchBacSchoolFrance || "",
      academicDiploma: lead.academicDiploma || "",
      higherEducationCountry: lead.higherEducationCountry || "",
      universityNameHebrew: lead.universityNameHebrew || "",
      diplomaNameHebrew: lead.diplomaNameHebrew || "",
      universityNameFrench: lead.universityNameFrench || "",
      diplomaNameFrench: lead.diplomaNameFrench || "",
    },
  });

  useEffect(() => {
    reset({
      bacObtention: lead.bacObtention || "",
      bacCountry: lead.bacCountry || "",
      bacType: lead.bacType || "",
      israeliBacSchool: lead.israeliBacSchool || "",
      frenchBacSchoolIsrael: lead.frenchBacSchoolIsrael || "",
      otherSchoolName: lead.otherSchoolName || "",
      jewishSchool: lead.jewishSchool || "",
      frenchBacSchoolFrance: lead.frenchBacSchoolFrance || "",
      academicDiploma: lead.academicDiploma || "",
      higherEducationCountry: lead.higherEducationCountry || "",
      universityNameHebrew: lead.universityNameHebrew || "",
      diplomaNameHebrew: lead.diplomaNameHebrew || "",
      universityNameFrench: lead.universityNameFrench || "",
      diplomaNameFrench: lead.diplomaNameFrench || "",
    });

    // Fetch pending change requests for this lead if user is a volunteer
    if (roleType[0] === RoleType.VOLONTAIRE) {
      dispatch(getChangeRequestsByLeadIdThunk(lead.ID));
    }
  }, [lead, reset, dispatch, roleType]);

  const bacObtention = useWatch({ control, name: "bacObtention" });
  const bacCountry = useWatch({ control, name: "bacCountry" });
  const bacType = useWatch({ control, name: "bacType" });
  const jewishSchool = useWatch({ control, name: "jewishSchool" });
  const israeliBacSchool = useWatch({ control, name: "israeliBacSchool" });
  const otherSchoolName = useWatch({ control, name: "otherSchoolName" });
  const academicDiploma = useWatch({ control, name: "academicDiploma" });
  const higherEducationCountry = useWatch({
    control,
    name: "higherEducationCountry",
  });

  const handleModeChange = () => {
    setMode((prevMode) => (prevMode === "VIEW" ? "EDIT" : "VIEW"));
  };

  const handleSave = async (data: Partial<Lead>) => {
    setLocalIsLoading(true);
    try {
      // Apply the same transformations as before
      const processedData = processEducationData(data);

      // Create originalLead with the same transformations for accurate comparison
      const originalLeadFormatted = processEducationData(lead) as Partial<Lead>;

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

  // Get pending change details for a field
  const getPendingChangeDetails = (fieldName: string) => {
    if (roleType[0] !== RoleType.VOLONTAIRE) return null;
    const pendingChange = changeRequestsByLead.find(
      (request) => request.fieldChanged === fieldName
    );

    return pendingChange || null;
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

    // Check for changes in each field that can be modified in this section
    const fieldsToCheck = [
      "bacObtention",
      "bacCountry",
      "bacType",
      "israeliBacSchool",
      "frenchBacSchoolIsrael",
      "otherSchoolName",
      "jewishSchool",
      "frenchBacSchoolFrance",
      "academicDiploma",
      "higherEducationCountry",
      "universityNameHebrew",
      "diplomaNameHebrew",
      "universityNameFrench",
      "diplomaNameFrench",
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
        title="Niveau Scolaire"
        mode={mode}
        onModeChange={handleModeChange}
        onSave={handleSubmit(handleSave)}
        onCancel={handleCancel}
        isLoading={localIsLoading}
      >
        <FormSubSection title="Enseignement secondaire">
          <FormDropdown
            control={control}
            name="bacObtention"
            label="Obtention BAC"
            mode={mode}
            options={EDUCATION.has_bac.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            isLoading={localIsLoading}
            disabled={hasFieldPendingChanges("bacObtention")}
            pendingChange={hasFieldPendingChanges("bacObtention")}
            pendingChangeDetails={
              getPendingChangeDetails("bacObtention")
                ? {
                    oldValue: getPendingChangeDetails("bacObtention")!.oldValue,
                    newValue: getPendingChangeDetails("bacObtention")!.newValue,
                  }
                : undefined
            }
          />
          <FormDropdown
            control={control}
            name="bacCountry"
            label="Pays BAC"
            mode={mode}
            options={EDUCATION.bac_country.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            hidden={bacObtention === "Non"}
            isLoading={localIsLoading}
            disabled={hasFieldPendingChanges("bacCountry")}
            pendingChange={hasFieldPendingChanges("bacCountry")}
            pendingChangeDetails={
              getPendingChangeDetails("bacCountry")
                ? {
                    oldValue: getPendingChangeDetails("bacCountry")!.oldValue,
                    newValue: getPendingChangeDetails("bacCountry")!.newValue,
                  }
                : undefined
            }
          />
          {/** Parcours Israelien*/}
          <FormDropdown
            control={control}
            name="bacType"
            label="Type BAC"
            mode={mode}
            options={EDUCATION.bac_type_israel.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            hidden={bacObtention === "Non" || bacCountry !== "Israel"}
            isLoading={localIsLoading}
            disabled={hasFieldPendingChanges("bacType")}
            pendingChange={hasFieldPendingChanges("bacType")}
            pendingChangeDetails={
              getPendingChangeDetails("bacType")
                ? {
                    oldValue: getPendingChangeDetails("bacType")!.oldValue,
                    newValue: getPendingChangeDetails("bacType")!.newValue,
                  }
                : undefined
            }
          />
          <FormDropdown
            control={control}
            name="israeliBacSchool"
            label="École BAC Israélien"
            mode={mode}
            options={EDUCATION.israeli_bac_schools.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            hidden={
              bacObtention === "Non" ||
              bacCountry !== "Israel" ||
              bacType !== "BAC israélien"
            }
            isLoading={localIsLoading}
            disabled={hasFieldPendingChanges("israeliBacSchool")}
            pendingChange={hasFieldPendingChanges("israeliBacSchool")}
            pendingChangeDetails={
              getPendingChangeDetails("israeliBacSchool")
                ? {
                    oldValue:
                      getPendingChangeDetails("israeliBacSchool")!.oldValue,
                    newValue:
                      getPendingChangeDetails("israeliBacSchool")!.newValue,
                  }
                : undefined
            }
          />
          <FormInput
            control={control}
            name="otherSchoolName"
            label="Autre école"
            mode={mode}
            hidden={
              bacObtention === "Non" ||
              bacCountry !== "Israel" ||
              bacType !== "BAC israélien" ||
              (israeliBacSchool !== "Autre" &&
                otherSchoolName !== israeliBacSchool)
            }
            isLoading={localIsLoading}
            readOnly={hasFieldPendingChanges("otherSchoolName")}
            pendingChange={hasFieldPendingChanges("otherSchoolName")}
            pendingChangeDetails={
              getPendingChangeDetails("otherSchoolName")
                ? {
                    oldValue:
                      getPendingChangeDetails("otherSchoolName")!.oldValue,
                    newValue:
                      getPendingChangeDetails("otherSchoolName")!.newValue,
                  }
                : undefined
            }
          />
          <FormDropdown
            control={control}
            name="frenchBacSchoolIsrael"
            label="École BAC Etranger"
            mode={mode}
            options={EDUCATION.foreign_bac_schools.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            hidden={
              bacObtention === "Non" ||
              bacCountry !== "Israel" ||
              bacType !== "BAC étranger"
            }
            isLoading={localIsLoading}
            disabled={hasFieldPendingChanges("frenchBacSchoolIsrael")}
            pendingChange={hasFieldPendingChanges("frenchBacSchoolIsrael")}
            pendingChangeDetails={
              getPendingChangeDetails("frenchBacSchoolIsrael")
                ? {
                    oldValue: getPendingChangeDetails("frenchBacSchoolIsrael")!
                      .oldValue,
                    newValue: getPendingChangeDetails("frenchBacSchoolIsrael")!
                      .newValue,
                  }
                : undefined
            }
          />
          {/**Fin Parcours Israelien*/}

          {/**Parcours Français*/}
          <FormDropdown
            control={control}
            name="jewishSchool"
            label="École Juive"
            mode={mode}
            options={EDUCATION.study_in_jewish_school.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            hidden={bacObtention === "Non" || bacCountry !== "Étranger"}
            isLoading={localIsLoading}
            disabled={hasFieldPendingChanges("jewishSchool")}
            pendingChange={hasFieldPendingChanges("jewishSchool")}
            pendingChangeDetails={
              getPendingChangeDetails("jewishSchool")
                ? {
                    oldValue: getPendingChangeDetails("jewishSchool")!.oldValue,
                    newValue: getPendingChangeDetails("jewishSchool")!.newValue,
                  }
                : undefined
            }
          />
          <FormInput
            control={control}
            name="frenchBacSchoolFrance"
            label="Nom école juive"
            mode={mode}
            hidden={
              bacObtention === "Non" ||
              bacCountry !== "Étranger" ||
              jewishSchool !== "Oui"
            }
            isLoading={localIsLoading}
            readOnly={hasFieldPendingChanges("frenchBacSchoolFrance")}
            pendingChange={hasFieldPendingChanges("frenchBacSchoolFrance")}
            pendingChangeDetails={
              getPendingChangeDetails("frenchBacSchoolFrance")
                ? {
                    oldValue: getPendingChangeDetails("frenchBacSchoolFrance")!
                      .oldValue,
                    newValue: getPendingChangeDetails("frenchBacSchoolFrance")!
                      .newValue,
                  }
                : undefined
            }
          />
          {/**Fin Parcours Français*/}
        </FormSubSection>
        <FormSubSection title="Enseignement supérieure/académique">
          <FormDropdown
            control={control}
            name="academicDiploma"
            label="Obtention diplome supérieure/académique"
            mode={mode}
            options={EDUCATION.has_higher_education.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            isLoading={localIsLoading}
            disabled={hasFieldPendingChanges("academicDiploma")}
            pendingChange={hasFieldPendingChanges("academicDiploma")}
            pendingChangeDetails={
              getPendingChangeDetails("academicDiploma")
                ? {
                    oldValue:
                      getPendingChangeDetails("academicDiploma")!.oldValue,
                    newValue:
                      getPendingChangeDetails("academicDiploma")!.newValue,
                  }
                : undefined
            }
          />
          <FormDropdown
            control={control}
            name="higherEducationCountry"
            label="Pays d'enseignement supérieur"
            mode={mode}
            options={EDUCATION.country_higher_education.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            hidden={academicDiploma === "Non"}
            isLoading={localIsLoading}
            disabled={hasFieldPendingChanges("higherEducationCountry")}
            pendingChange={hasFieldPendingChanges("higherEducationCountry")}
            pendingChangeDetails={
              getPendingChangeDetails("higherEducationCountry")
                ? {
                    oldValue: getPendingChangeDetails("higherEducationCountry")!
                      .oldValue,
                    newValue: getPendingChangeDetails("higherEducationCountry")!
                      .newValue,
                  }
                : undefined
            }
          />
          <FormInput
            control={control}
            name="universityNameHebrew"
            label="Nom universite en hebreu"
            mode={mode}
            hidden={
              academicDiploma === "Non" || higherEducationCountry !== "Israël"
            }
            isLoading={localIsLoading}
            readOnly={hasFieldPendingChanges("universityNameHebrew")}
            pendingChange={hasFieldPendingChanges("universityNameHebrew")}
            pendingChangeDetails={
              getPendingChangeDetails("universityNameHebrew")
                ? {
                    oldValue: getPendingChangeDetails("universityNameHebrew")!
                      .oldValue,
                    newValue: getPendingChangeDetails("universityNameHebrew")!
                      .newValue,
                  }
                : undefined
            }
          />
          <FormInput
            control={control}
            name="diplomaNameHebrew"
            label="Nom diplome en hebreu"
            mode={mode}
            hidden={
              academicDiploma === "Non" || higherEducationCountry !== "Israël"
            }
            isLoading={localIsLoading}
            readOnly={hasFieldPendingChanges("diplomaNameHebrew")}
            pendingChange={hasFieldPendingChanges("diplomaNameHebrew")}
            pendingChangeDetails={
              getPendingChangeDetails("diplomaNameHebrew")
                ? {
                    oldValue:
                      getPendingChangeDetails("diplomaNameHebrew")!.oldValue,
                    newValue:
                      getPendingChangeDetails("diplomaNameHebrew")!.newValue,
                  }
                : undefined
            }
          />
          <FormInput
            control={control}
            name="universityNameFrench"
            label="Nom universite en français"
            mode={mode}
            hidden={
              academicDiploma === "Non" ||
              higherEducationCountry !== "À l'étranger"
            }
            isLoading={localIsLoading}
            readOnly={hasFieldPendingChanges("universityNameFrench")}
            pendingChange={hasFieldPendingChanges("universityNameFrench")}
            pendingChangeDetails={
              getPendingChangeDetails("universityNameFrench")
                ? {
                    oldValue: getPendingChangeDetails("universityNameFrench")!
                      .oldValue,
                    newValue: getPendingChangeDetails("universityNameFrench")!
                      .newValue,
                  }
                : undefined
            }
          />
          <FormInput
            control={control}
            name="diplomaNameFrench"
            label="Nom diplome en français"
            mode={mode}
            hidden={
              academicDiploma === "Non" ||
              higherEducationCountry !== "À l'étranger"
            }
            isLoading={localIsLoading}
            readOnly={hasFieldPendingChanges("diplomaNameFrench")}
            pendingChange={hasFieldPendingChanges("diplomaNameFrench")}
            pendingChangeDetails={
              getPendingChangeDetails("diplomaNameFrench")
                ? {
                    oldValue:
                      getPendingChangeDetails("diplomaNameFrench")!.oldValue,
                    newValue:
                      getPendingChangeDetails("diplomaNameFrench")!.newValue,
                  }
                : undefined
            }
          />
        </FormSubSection>
      </FormSection>
    </form>
  );
};
