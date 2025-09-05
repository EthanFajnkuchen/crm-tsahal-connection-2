import { useForm, useWatch } from "react-hook-form";
import { Lead } from "@/types/lead";
import { FormInput } from "@/components/form-components/form-input";
import {
  FormSection,
  FormSubSection,
} from "@/components/form-components/form-section";
import { FormDropdown } from "@/components/form-components/form-dropdown";
import { useEffect } from "react";
import { EDUCATION } from "@/i18n/education";
import { ChangeRequest } from "@/types/change-request";
import { useVolunteerForm } from "@/hooks/use-volunteer-form";
import { processEducationData } from "@/utils/form-data-processors";

interface EducationSectionProps {
  lead: Lead;
  changeRequestsByLead: ChangeRequest[];
}

export const EducationSection = ({
  lead,
  changeRequestsByLead,
}: EducationSectionProps) => {
  // Fields that can be modified in this section
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

  // Initialize volunteer form hook
  const {
    mode,
    localIsLoading,
    handleSave,
    handleModeChange,
    handleCancel,
    getFieldProps,
  } = useVolunteerForm({
    lead,
    changeRequestsByLead,
    fieldsToCheck,
    dataProcessor: processEducationData,
  });

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
  }, [lead, reset]);

  // Watch values for conditional rendering
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
        title="Niveau Scolaire"
        mode={mode}
        onModeChange={handleModeChange}
        onSave={handleSubmit(onSave)}
        onCancel={onCancel}
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
            {...getFieldProps("bacObtention")}
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
            {...getFieldProps("bacCountry")}
          />

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
            {...getFieldProps("bacType")}
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
            {...getFieldProps("israeliBacSchool")}
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
            {...getFieldProps("otherSchoolName")}
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
            {...getFieldProps("frenchBacSchoolIsrael")}
          />

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
            {...getFieldProps("jewishSchool")}
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
            {...getFieldProps("frenchBacSchoolFrance")}
          />
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
            {...getFieldProps("academicDiploma")}
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
            {...getFieldProps("higherEducationCountry")}
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
            {...getFieldProps("universityNameHebrew")}
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
            {...getFieldProps("diplomaNameHebrew")}
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
            {...getFieldProps("universityNameFrench")}
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
            {...getFieldProps("diplomaNameFrench")}
          />
        </FormSubSection>
      </FormSection>
    </form>
  );
};
