import React, { useEffect } from "react";
import { UseFormReturn, Controller, useWatch } from "react-hook-form";
import { FormInput } from "@/components/form-components/form-input";
import { FormDropdown } from "@/components/form-components/form-dropdown";
import { FormDatePicker } from "@/components/form-components/form-date-picker";
import { LeadFormData } from "../LeadForm";
import { JUDAISM } from "@/i18n/judaism";
import { NATIONALITY } from "@/i18n/nationality";

interface JudaismNationalityStepProps {
  form: UseFormReturn<LeadFormData>;
}

export const JudaismNationalityStep: React.FC<JudaismNationalityStepProps> = ({
  form,
}) => {
  const { control } = form;

  // Watch values for conditional rendering
  const statutLoiRetour = useWatch({ control, name: "StatutLoiRetour" });
  const statutResidentIsrael = useWatch({
    control,
    name: "statutResidentIsrael",
  });
  const numberOfNationalities = useWatch({
    control,
    name: "numberOfNationalities",
  });
  const hasIsraeliID = useWatch({ control, name: "hasIsraeliID" });

  // Check if nationality1 should be locked to "Israélienne"
  const isNationality1Locked = [
    "Ole Hadash",
    "Ben Meager",
    "Katin Hozer",
    "Tochav Hozer",
  ].includes(statutResidentIsrael || "");

  // Auto-set nationality1 to "Israélienne" when statutResidentIsrael matches specific values
  // or clear it when changing to a different status
  useEffect(() => {
    if (isNationality1Locked) {
      form.setValue("nationality1", "Israélienne");
    } else {
      // Only clear nationality1 if it's currently "Israélienne" and we're changing to a status that doesn't lock it
      const currentNationality1 = form.getValues("nationality1");
      if (currentNationality1 === "Israélienne") {
        form.setValue("nationality1", "");
      }
    }
  }, [isNationality1Locked, form]);

  return (
    <div className="space-y-8">
      {/* Religion Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Religion
        </h3>

        <Controller
          control={control}
          name="StatutLoiRetour"
          rules={{
            required:
              "Le statut vis-à-vis de la loi du retour en Israël est requis",
          }}
          render={({ fieldState }) => (
            <FormDropdown
              control={control}
              name="StatutLoiRetour"
              label="Statut vis-à-vis de la loi du retour en Israël"
              options={JUDAISM.status_return_law.map((option) => ({
                value: option.value,
                label: option.displayName,
              }))}
              required
              passDisplayName={true}
              error={fieldState.error?.message}
            />
          )}
        />

        {statutLoiRetour === "Juif converti" && (
          <>
            <Controller
              control={control}
              name="conversionDate"
              rules={{
                required:
                  "La date indiquée sur votre certificat de conversion est requise",
              }}
              render={({ fieldState }) => (
                <FormDatePicker
                  control={control as any}
                  name="conversionDate"
                  label="Quelle est la date indiquée sur votre certificat de conversion?"
                  required
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="conversionAgency"
              rules={{
                required:
                  "L'organisme en charge de votre conversion est requis",
              }}
              render={({ fieldState }) => (
                <FormDropdown
                  control={control}
                  name="conversionAgency"
                  label="Quel est l'organisme en charge de votre conversion?"
                  options={JUDAISM.conversion_organization.map((option) => ({
                    value: option.value,
                    label: option.displayName,
                  }))}
                  required
                  passDisplayName
                  error={fieldState.error?.message}
                />
              )}
            />
          </>
        )}
      </div>

      {/* Nationalités Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Nationalités
        </h3>

        <Controller
          control={control}
          name="statutResidentIsrael"
          rules={{ required: "Le statut de résident en Israël est requis" }}
          render={({ fieldState }) => (
            <FormDropdown
              control={control}
              name="statutResidentIsrael"
              label="Quel est votre statut de résident en Israël ?"
              options={NATIONALITY.resident_status_in_israel.map((option) => ({
                value: option.value,
                label: option.displayName,
              }))}
              required
              passDisplayName
              error={fieldState.error?.message}
            />
          )}
        />

        {["Ole Hadash", "Katin Hozer", "Tochav Hozer", "Ezrah Olé"].includes(
          statutResidentIsrael || ""
        ) && (
          <Controller
            control={control}
            name="anneeAlyah"
            rules={{ required: "L'année d'Alyah est requise" }}
            render={({ fieldState }) => (
              <FormInput
                control={control}
                name="anneeAlyah"
                label="Année d'alyah"
                required
                error={fieldState.error?.message}
              />
            )}
          />
        )}

        {["Ole Hadash", "Katin Hozer", "Tochav Hozer", "Ben Meager"].includes(
          statutResidentIsrael || ""
        ) && (
          <>
            <Controller
              control={control}
              name="hasIsraeliID"
              rules={{ required: "L'ID Israélien est requis" }}
              render={({ fieldState }) => (
                <FormDropdown
                  control={control}
                  name="hasIsraeliID"
                  label="Possédez-vous un numéro d'identité israélienne (ID NUMBER) ?"
                  options={NATIONALITY.has_israeli_id.map((option) => ({
                    value: option.value.toString(),
                    label: option.displayName,
                  }))}
                  required
                  passDisplayName
                  error={fieldState.error?.message}
                />
              )}
            />

            {hasIsraeliID === "Oui" && (
              <Controller
                control={control}
                name="israeliIDNumber"
                rules={{
                  required: "Le numéro d'identité israélienne est requis",
                }}
                render={({ fieldState }) => (
                  <FormInput
                    control={control}
                    name="israeliIDNumber"
                    label="Numéro d'identité israélienne (ID NUMBER) :"
                    required
                    error={fieldState.error?.message}
                  />
                )}
              />
            )}
          </>
        )}

        <Controller
          control={control}
          name="numberOfNationalities"
          rules={{ required: "Le nombre de nationalités est requis" }}
          render={({ fieldState }) => (
            <FormDropdown
              control={control}
              name="numberOfNationalities"
              label="Combien de nationalités possédez-vous ?"
              options={NATIONALITY.number_of_nationality.map((option) => ({
                value: option.value.toString(),
                label: option.displayName,
              }))}
              required
              passDisplayName
              error={fieldState.error?.message}
            />
          )}
        />

        {/* Nationalité 1 - Toujours requise */}
        <Controller
          control={control}
          name="nationality1"
          rules={{ required: "La première nationalité est requise" }}
          render={({ fieldState }) => (
            <FormDropdown
              control={control}
              name="nationality1"
              label="Nationalité 1 :"
              options={NATIONALITY.nationalities.map((option) => ({
                value: option.value,
                label: option.displayName,
              }))}
              required
              passDisplayName
              disabled={isNationality1Locked}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="passportNumber1"
          render={({ fieldState }) => (
            <FormInput
              control={control}
              name="passportNumber1"
              label="Numéro de passeport - Nationalité 1 :"
              error={fieldState.error?.message}
            />
          )}
        />

        {/* Nationalité 2 - Conditionnelle */}
        {numberOfNationalities !== "1" && (
          <>
            <Controller
              control={control}
              name="nationality2"
              rules={{ required: "La deuxième nationalité est requise" }}
              render={({ fieldState }) => (
                <FormDropdown
                  control={control}
                  name="nationality2"
                  label="Nationalité 2 :"
                  options={NATIONALITY.nationalities.map((option) => ({
                    value: option.value,
                    label: option.displayName,
                  }))}
                  required
                  passDisplayName
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="passportNumber2"
              render={({ fieldState }) => (
                <FormInput
                  control={control}
                  name="passportNumber2"
                  label="Numéro de passeport - Nationalité 2 :"
                  error={fieldState.error?.message}
                />
              )}
            />
          </>
        )}

        {/* Nationalité 3 - Conditionnelle */}
        {numberOfNationalities === "3" && (
          <>
            <Controller
              control={control}
              name="nationality3"
              rules={{ required: "La troisième nationalité est requise" }}
              render={({ fieldState }) => (
                <FormDropdown
                  control={control}
                  name="nationality3"
                  label="Nationalité 3 :"
                  options={NATIONALITY.nationalities.map((option) => ({
                    value: option.value,
                    label: option.displayName,
                  }))}
                  required
                  passDisplayName
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="passportNumber3"
              render={({ fieldState }) => (
                <FormInput
                  control={control}
                  name="passportNumber3"
                  label="Numéro de passeport - Nationalité 3 :"
                  error={fieldState.error?.message}
                />
              )}
            />
          </>
        )}
      </div>
    </div>
  );
};
