import { useForm, useWatch } from "react-hook-form";
import { Lead } from "@/types/lead";
import { FormInput } from "@/components/form-components/form-input";
import {
  FormSection,
  FormSubSection,
} from "@/components/form-components/form-section";
import { FormDropdown } from "@/components/form-components/form-dropdown";
import { FormDatePicker } from "@/components/form-components/form-date-picker";
import { JUDAISM } from "@/i18n/judaism";
import { useEffect } from "react";
import { NATIONALITY } from "@/i18n/nationality";
import { ChangeRequest } from "@/types/change-request";
import { useForm as useFormLogic } from "@/hooks/use-form";
import { processJudaismNationalityData } from "@/utils/form-data-processors";

interface JudaismNationalitySectionProps {
  lead: Lead;
  changeRequestsByLead: ChangeRequest[];
}

export const JudaismNationalitySection = ({
  lead,
  changeRequestsByLead,
}: JudaismNationalitySectionProps) => {
  // Fields that can be modified in this section
  const fieldsToCheck = [
    "StatutLoiRetour",
    "conversionDate",
    "conversionAgency",
    "statutResidentIsrael",
    "anneeAlyah",
    "hasIsraeliID",
    "israeliIDNumber",
    "numberOfNationalities",
    "nationality1",
    "passportNumber1",
    "nationality2",
    "passportNumber2",
    "nationality3",
    "passportNumber3",
  ];

  // Date fields for proper formatting
  const dateFields = ["conversionDate"];

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
    dateFields,
    dataProcessor: processJudaismNationalityData,
  });

  const { control, handleSubmit, reset } = useForm<Partial<Lead>>({
    defaultValues: {
      StatutLoiRetour: lead.StatutLoiRetour || "",
      conversionDate: lead.conversionDate || "",
      conversionAgency: lead.conversionAgency || "",
      statutResidentIsrael: lead.statutResidentIsrael || "",
      anneeAlyah: lead.anneeAlyah || "",
      numberOfNationalities: lead.numberOfNationalities || "",
      nationality1: lead.nationality1 || "",
      passportNumber1: lead.passportNumber1 || "",
      nationality2: lead.nationality2 || "",
      passportNumber2: lead.passportNumber2 || "",
      nationality3: lead.nationality3 || "",
      passportNumber3: lead.passportNumber3 || "",
      hasIsraeliID: lead.hasIsraeliID || "",
      israeliIDNumber: lead.israeliIDNumber || "",
    },
  });

  useEffect(() => {
    reset({
      StatutLoiRetour: lead.StatutLoiRetour || "",
      conversionDate: lead.conversionDate || "",
      conversionAgency: lead.conversionAgency || "",
      statutResidentIsrael: lead.statutResidentIsrael || "",
      anneeAlyah: lead.anneeAlyah || "",
      numberOfNationalities: lead.numberOfNationalities || "",
      nationality1: lead.nationality1 || "",
      passportNumber1: lead.passportNumber1 || "",
      nationality2: lead.nationality2 || "",
      passportNumber2: lead.passportNumber2 || "",
      nationality3: lead.nationality3 || "",
      passportNumber3: lead.passportNumber3 || "",
      hasIsraeliID: lead.hasIsraeliID || "",
      israeliIDNumber: lead.israeliIDNumber || "",
    });
  }, [lead, reset]);

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
  const hasIsraeliID = useWatch({
    control,
    name: "hasIsraeliID",
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
        title="Religion & nationalités"
        mode={mode}
        onModeChange={handleModeChange}
        onSave={handleSubmit(onSave)}
        onCancel={onCancel}
        isLoading={localIsLoading}
      >
        <FormSubSection title="Religion">
          <FormDropdown
            control={control}
            name="StatutLoiRetour"
            label="Statut Loi Retour"
            mode={mode}
            options={JUDAISM.status_return_law.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            isLoading={localIsLoading}
            {...getFieldProps("StatutLoiRetour")}
          />

          <FormDatePicker
            control={control}
            name="conversionDate"
            label="Date de conversion"
            mode={mode}
            hidden={statutLoiRetour !== "Juif converti"}
            isLoading={localIsLoading}
            {...getFieldProps("conversionDate")}
          />

          <FormDropdown
            control={control}
            name="conversionAgency"
            label="Agence de conversion"
            mode={mode}
            options={JUDAISM.conversion_organization.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            hidden={statutLoiRetour !== "Juif converti"}
            isLoading={localIsLoading}
            {...getFieldProps("conversionAgency")}
          />
        </FormSubSection>

        <FormSubSection title="Nationalités">
          <FormDropdown
            control={control}
            name="statutResidentIsrael"
            label="Statut résident Israël"
            mode={mode}
            options={NATIONALITY.resident_status_in_israel.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            isLoading={localIsLoading}
            {...getFieldProps("statutResidentIsrael")}
          />

          <FormInput
            control={control}
            name="anneeAlyah"
            label="Année d'Alyah"
            mode={mode}
            hidden={
              ![
                "Ole Hadash",
                "Katin Hozer",
                "Tochav Hozer",
                "Ezrah Olé",
              ].includes(statutResidentIsrael || "")
            }
            isLoading={localIsLoading}
            {...getFieldProps("anneeAlyah")}
          />

          <FormDropdown
            control={control}
            name="hasIsraeliID"
            label="ID Israélien"
            mode={mode}
            options={NATIONALITY.has_israeli_id.map((option) => ({
              value: option.value.toString(),
              label: option.displayName,
            }))}
            isLoading={localIsLoading}
            hidden={
              ![
                "Ole Hadash",
                "Katin Hozer",
                "Tochav Hozer",
                "Ben Meager",
              ].includes(statutResidentIsrael || "")
            }
            {...getFieldProps("hasIsraeliID")}
          />

          <FormInput
            control={control}
            name="israeliIDNumber"
            label="ID"
            mode={mode}
            hidden={hasIsraeliID !== "Oui"}
            isLoading={localIsLoading}
            {...getFieldProps("israeliIDNumber")}
          />

          <FormDropdown
            control={control}
            name="numberOfNationalities"
            label="Nombre de nationalités"
            mode={mode}
            options={NATIONALITY.number_of_nationality.map((option) => ({
              value: option.value.toString(),
              label: option.displayName,
            }))}
            isLoading={localIsLoading}
            {...getFieldProps("numberOfNationalities")}
          />

          <FormDropdown
            control={control}
            name="nationality1"
            label="Nationalité 1"
            mode={mode}
            options={NATIONALITY.nationalities.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            isLoading={localIsLoading}
            {...getFieldProps("nationality1")}
          />

          <FormInput
            control={control}
            name="passportNumber1"
            label="Numéro de passeport 1"
            mode={mode}
            isLoading={localIsLoading}
            {...getFieldProps("passportNumber1")}
          />

          <FormDropdown
            control={control}
            name="nationality2"
            label="Nationalité 2"
            mode={mode}
            options={NATIONALITY.nationalities.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            hidden={numberOfNationalities === "1"}
            isLoading={localIsLoading}
            {...getFieldProps("nationality2")}
          />

          <FormInput
            control={control}
            name="passportNumber2"
            label="Numéro de passeport 2"
            mode={mode}
            hidden={numberOfNationalities === "1"}
            isLoading={localIsLoading}
            {...getFieldProps("passportNumber2")}
          />

          <FormDropdown
            control={control}
            name="nationality3"
            label="Nationalité 3"
            mode={mode}
            options={NATIONALITY.nationalities.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            hidden={
              numberOfNationalities === "1" || numberOfNationalities === "2"
            }
            isLoading={localIsLoading}
            {...getFieldProps("nationality3")}
          />

          <FormInput
            control={control}
            name="passportNumber3"
            label="Numéro de passeport 3"
            mode={mode}
            hidden={
              numberOfNationalities === "1" || numberOfNationalities === "2"
            }
            isLoading={localIsLoading}
            {...getFieldProps("passportNumber3")}
          />
        </FormSubSection>
      </FormSection>
    </form>
  );
};
