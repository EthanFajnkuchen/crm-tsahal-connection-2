import { useForm, useWatch } from "react-hook-form";
import { Lead } from "@/types/lead";
import {
  FormSection,
  FormSubSection,
} from "@/components/form-components/form-section";
import { FormDropdown } from "@/components/form-components/form-dropdown";
import { useEffect } from "react";
import { INTEGRATION_IN_ISRAEL } from "@/i18n/integration-in-israel";
import { FormInput } from "@/components/form-components/form-input";
import { ChangeRequest } from "@/types/change-request";
import { useForm as useFormLogic } from "@/hooks/use-form";
import { processIntegrationIsraelData } from "@/utils/form-data-processors";

interface IntegrationIsraelSectionProps {
  lead: Lead;
  changeRequestsByLead: ChangeRequest[];
}

export const IntegrationIsraelSection = ({
  lead,
  changeRequestsByLead,
}: IntegrationIsraelSectionProps) => {
  // Fields that can be modified in this section
  const fieldsToCheck = [
    "arrivalAge",
    "programParticipation",
    "programName",
    "schoolYears",
    "armyDeferralProgram",
    "programNameHebrewArmyDeferral",
  ];

  // Initialize volunteer form hook
  const {
    mode,
    localIsLoading,
    handleSave,
    handleModeChange,
    handleCancel,
    getFieldProps,
  } = useFormLogic({
    lead,
    changeRequestsByLead,
    fieldsToCheck,
    dataProcessor: processIntegrationIsraelData,
  });

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

  // Watch values for conditional rendering
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

  // Wrap the handleSave function to pass reset
  const onSave = (data: Partial<Lead>) => {
    handleSave(data, reset);
  };

  // Wrap the handleCancel function to pass reset
  const onCancel = () => {
    handleCancel(reset);
  };

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <FormSection
        title="Intégration en Israël"
        mode={mode}
        onModeChange={handleModeChange}
        onSave={handleSubmit(onSave)}
        onCancel={onCancel}
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
            {...getFieldProps("arrivalAge")}
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
            {...getFieldProps("programParticipation")}
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
            {...getFieldProps("programName")}
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
            {...getFieldProps("schoolYears")}
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
            {...getFieldProps("armyDeferralProgram")}
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
            {...getFieldProps("programNameHebrewArmyDeferral")}
          />
        </FormSubSection>
      </FormSection>
    </form>
  );
};
