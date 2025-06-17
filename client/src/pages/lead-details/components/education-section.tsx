import { useForm, useWatch } from "react-hook-form";
import { Lead } from "@/types/lead";
import { FormInput } from "@/components/form-components/form-input";
import {
  FormSection,
  FormSubSection,
} from "@/components/form-components/form-section";
import { FormDropdown } from "@/components/form-components/form-dropdown";
import { useState } from "react";
import { EDUCATION } from "@/i18n/education";

interface EducationSectionProps {
  lead: Lead;
}

export const EducationSection = ({ lead }: EducationSectionProps) => {
  const [mode, setMode] = useState<"EDIT" | "VIEW">("VIEW");
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
        title="Niveau Scolaire"
        mode={mode}
        onModeChange={handleModeChange}
        onSave={handleSubmit(handleSave)}
        onCancel={handleCancel}
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
              otherSchoolName !== israeliBacSchool
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
          />
          <FormInput
            control={control}
            name="universityNameHebrew"
            label="Nom universite en hebreu"
            mode={mode}
            hidden={
              academicDiploma === "Non" || higherEducationCountry !== "Israël"
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
          />
        </FormSubSection>
      </FormSection>
    </form>
  );
};
