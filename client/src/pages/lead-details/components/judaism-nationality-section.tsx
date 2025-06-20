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

import { useState, useEffect } from "react";
import { NATIONALITY } from "@/i18n/nationality";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { updateLeadThunk } from "@/store/thunks/lead-details/lead-details.thunk";
import { toast } from "sonner";
import { processJudaismNationalityData } from "../setters/judaism-nationality-setter";

interface JudaismNationalitySectionProps {
  lead: Lead;
}

export const JudaismNationalitySection = ({
  lead,
}: JudaismNationalitySectionProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [mode, setMode] = useState<"EDIT" | "VIEW">("VIEW");
  const [localIsLoading, setLocalIsLoading] = useState(false);
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
    });
  }, [lead, reset]);

  const statutLoiRetour = useWatch({ control, name: "StatutLoiRetour" });
  const statutResidentIsrael = useWatch({
    control,
    name: "statutResidentIsrael",
  });
  const numberOfNationalities = useWatch({
    control,
    name: "numberOfNationalities",
  });

  console.log(
    ["Ole Hadash", "Katin Hozer", "Tochav Hozer"].includes(
      statutResidentIsrael || ""
    )
  );
  const handleModeChange = () => {
    setMode((prevMode) => (prevMode === "VIEW" ? "EDIT" : "VIEW"));
  };

  const handleSave = async (data: Partial<Lead>) => {
    setLocalIsLoading(true);
    const formattedData = processJudaismNationalityData(data);
    try {
      await dispatch(
        updateLeadThunk({
          id: lead.ID.toString(),
          updateData: formattedData,
        })
      ).unwrap();

      toast.success("Le lead a été modifié avec succès");
      setMode("VIEW");
    } catch (error) {
      console.error("Failed to update lead:", error);
      toast.error("Erreur lors de la modification du lead");
    } finally {
      setLocalIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setMode("VIEW");
  };

  return (
    <form onSubmit={handleSubmit(handleSave)}>
      <FormSection
        title="Religion & nationalités"
        mode={mode}
        onModeChange={handleModeChange}
        onSave={handleSubmit(handleSave)}
        onCancel={handleCancel}
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
          />
          <FormDatePicker
            control={control}
            name="conversionDate"
            label="Date de conversion"
            mode={mode}
            hidden={statutLoiRetour !== "Juif converti"}
            isLoading={localIsLoading}
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
          />
          <FormInput
            control={control}
            name="anneeAlyah"
            label="Année d'Alyah"
            mode={mode}
            hidden={
              !["Ole Hadash", "Katin Hozer", "Tochav Hozer"].includes(
                statutResidentIsrael || ""
              )
            }
            isLoading={localIsLoading}
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
          />
          <FormInput
            control={control}
            name="passportNumber1"
            label="Numéro de passeport 1"
            mode={mode}
            isLoading={localIsLoading}
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
          />
          <FormInput
            control={control}
            name="passportNumber2"
            label="Numéro de passeport 2"
            mode={mode}
            hidden={numberOfNationalities === "1"}
            isLoading={localIsLoading}
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
          />
        </FormSubSection>
      </FormSection>
    </form>
  );
};
