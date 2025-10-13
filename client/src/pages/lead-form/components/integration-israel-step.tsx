import React, { useEffect } from "react";
import { UseFormReturn, Controller, useWatch } from "react-hook-form";
import { FormInput } from "@/components/form-components/form-input";
import { FormDropdown } from "@/components/form-components/form-dropdown";
import { LeadFormData } from "../LeadForm";
import { INTEGRATION_IN_ISRAEL } from "@/i18n/integration-in-israel";

interface IntegrationIsraelStepProps {
  form: UseFormReturn<LeadFormData>;
}

export const IntegrationIsraelStep: React.FC<IntegrationIsraelStepProps> = ({
  form,
}) => {
  const { control } = form;

  // Watch values for conditional rendering
  const arrivalAge = useWatch({ control, name: "arrivalAge" });
  const programParticipation = useWatch({
    control,
    name: "programParticipation",
  });
  const armyDeferralProgram = useWatch({
    control,
    name: "armyDeferralProgram",
  });

  // Auto-clear fields based on integration-israel-section.tsx logic
  useEffect(() => {
    // Clear program fields if arrival age is not "Après mes 14 ans"
    if (arrivalAge !== "Après mes 14 ans") {
      form.setValue("programParticipation", "");
      form.setValue("programName", "");
      form.setValue("schoolYears", "");
    }

    // Clear program name if program participation is not in the required list
    if (
      !["Massa", "Midrasha", "Université", "Taka", "Yeshiva", "Autre"].includes(
        programParticipation || ""
      ) ||
      arrivalAge !== "Après mes 14 ans"
    ) {
      form.setValue("programName", "");
    }

    // Clear school years if program participation is not in the required list
    if (
      ![
        "Lycée francophone",
        "Massa",
        "Midrasha",
        "Naalé",
        "Université",
        "Taka",
        "Yeshiva",
        "Autre",
      ].includes(programParticipation || "") ||
      arrivalAge !== "Après mes 14 ans"
    ) {
      form.setValue("schoolYears", "");
    }

    // Clear program name Hebrew if army deferral program is not in the required list
    if (
      !["Chnat Chirout", "Mechina", "Yeshiva", "Autre"].includes(
        armyDeferralProgram || ""
      )
    ) {
      form.setValue("programNameHebrewArmyDeferral", "");
    }
  }, [arrivalAge, programParticipation, armyDeferralProgram, form]);

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Intégration en Israël
        </h3>

        <Controller
          control={control}
          name="arrivalAge"
          rules={{ required: "L'âge d'arrivée en Israël est requis" }}
          render={({ field: _, fieldState }) => (
            <FormDropdown
              control={control}
              name="arrivalAge"
              label="À quel âge êtes-vous/allez-vous arriver en Israël ?"
              options={INTEGRATION_IN_ISRAEL.age_get_in_israel.map(
                (option) => ({
                  value: option.value,
                  label: option.displayName,
                })
              )}
              required
              passDisplayName
              error={fieldState.error?.message}
            />
          )}
        />

        {arrivalAge === "Après mes 14 ans" && (
          <Controller
            control={control}
            name="programParticipation"
            rules={{ required: "Le programme d'intégration est requis" }}
            render={({ field: _, fieldState }) => (
              <FormDropdown
                control={control}
                name="programParticipation"
                label="Avez/Êtes-vous en train de/Allez-vous participer à un de ces types de programme dès votre arrivée en Israël pour une durée de plus de 4 mois ?"
                options={INTEGRATION_IN_ISRAEL.integration_programs.map(
                  (option) => ({
                    value: option.value,
                    label: option.displayName,
                  })
                )}
                required
                passDisplayName
                error={fieldState.error?.message}
              />
            )}
          />
        )}

        {arrivalAge === "Après mes 14 ans" &&
          [
            "Massa",
            "Midrasha",
            "Université",
            "Taka",
            "Yeshiva",
            "Autre",
          ].includes(programParticipation || "") && (
            <Controller
              control={control}
              name="programName"
              rules={{ required: "Le nom du programme est requis" }}
              render={({ field: _, fieldState }) => (
                <FormDropdown
                  control={control}
                  name="programName"
                  label="Quel est le nom du programme ?"
                  options={INTEGRATION_IN_ISRAEL.integration_program_names.map(
                    (option) => ({
                      value: option.value,
                      label: option.displayName,
                    })
                  )}
                  required
                  passDisplayName
                  error={fieldState.error?.message}
                />
              )}
            />
          )}

        {arrivalAge === "Après mes 14 ans" &&
          [
            "Lycée francophone",
            "Massa",
            "Midrasha",
            "Naalé",
            "Université",
            "Taka",
            "Yeshiva",
            "Autre",
          ].includes(programParticipation || "") && (
            <Controller
              control={control}
              name="schoolYears"
              rules={{
                required: "Les années d'études sont requises",
                pattern: {
                  value: /^\d{4}-\d{4}$/,
                  message: "Le format doit être XXXX-XXXX (exemple: 2022-2023)",
                },
              }}
              render={({ field: _, fieldState }) => (
                <FormInput
                  control={control}
                  name="schoolYears"
                  label="En quelle(s) année(s) scolaire(s) avez-vous/allez-vous participer à ce programme ? (format: XXXX-XXXX)"
                  required
                  error={fieldState.error?.message}
                />
              )}
            />
          )}

        <Controller
          control={control}
          name="armyDeferralProgram"
          rules={{ required: "Le programme pré-armée est requis" }}
          render={({ field: _, fieldState }) => (
            <FormDropdown
              control={control}
              name="armyDeferralProgram"
              label="Pour les candidats effectuant un service complet, avez-vous/souhaitez-vous repoussé votre entrée à l'armée dans le cadre d'un des programmes suivants :"
              options={INTEGRATION_IN_ISRAEL.army_deferral_programs.map(
                (option) => ({
                  value: option.value,
                  label: option.displayName,
                })
              )}
              required
              passDisplayName
              error={fieldState.error?.message}
            />
          )}
        />

        {["Chnat Chirout", "Mechina", "Yeshiva", "Autre"].includes(
          armyDeferralProgram || ""
        ) && (
          <Controller
            control={control}
            name="programNameHebrewArmyDeferral"
            rules={{ required: "Le nom du programme en hébreu est requis" }}
            render={({ field: _, fieldState }) => (
              <FormInput
                control={control}
                name="programNameHebrewArmyDeferral"
                label="Quel est le nom du programme ? Merci de l'écrire en hébreu (exemple : גור אריה/לביא)."
                required
                error={fieldState.error?.message}
              />
            )}
          />
        )}
      </div>
    </div>
  );
};
