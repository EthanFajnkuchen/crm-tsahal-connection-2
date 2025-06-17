import { useForm, useWatch } from "react-hook-form";
import { Lead } from "@/types/lead";
import {
  FormSection,
  FormSubSection,
} from "@/components/form-components/form-section";
import { FormDropdown } from "@/components/form-components/form-dropdown";
import { useState } from "react";
import { INTEGRATION_IN_ISRAEL } from "@/i18n/integration-in-israel";
import { FormInput } from "@/components/form-components/form-input";

interface IntegrationIsraelSectionProps {
  lead: Lead;
}

export const IntegrationIsraelSection = ({
  lead,
}: IntegrationIsraelSectionProps) => {
  const [mode, setMode] = useState<"EDIT" | "VIEW">("VIEW");
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

  const handleSave = (data: Partial<Lead>) => {
    console.log("Saving data:", data);
    // TODO: Implement save logic
    setMode("VIEW");
  };

  const handleCancel = () => {
    reset();
    setMode("VIEW");
  };

  return (
    <form onSubmit={handleSubmit(handleSave)}>
      <FormSection
        title="Intégration en Israël"
        mode={mode}
        onModeChange={handleModeChange}
        onSave={handleSubmit(handleSave)}
        onCancel={handleCancel}
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
          />
        </FormSubSection>
      </FormSection>
    </form>
  );
};
