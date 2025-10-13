import React, { useEffect } from "react";
import { UseFormReturn, Controller, useWatch } from "react-hook-form";
import { FormInput } from "@/components/form-components/form-input";
import { FormDropdown } from "@/components/form-components/form-dropdown";
import { LeadFormData } from "../LeadForm";
import { EDUCATION } from "@/i18n/education";

interface EducationStepProps {
  form: UseFormReturn<LeadFormData>;
}

export const EducationStep: React.FC<EducationStepProps> = ({ form }) => {
  const { control } = form;

  // Watch values for conditional rendering
  const bacObtention = useWatch({ control, name: "bacObtention" });
  const bacCountry = useWatch({ control, name: "bacCountry" });
  const bacType = useWatch({ control, name: "bacType" });
  const jewishSchool = useWatch({ control, name: "jewishSchool" });
  const israeliBacSchool = useWatch({ control, name: "israeliBacSchool" });
  const academicDiploma = useWatch({ control, name: "academicDiploma" });
  const higherEducationCountry = useWatch({
    control,
    name: "higherEducationCountry",
  });

  // Auto-clear fields based on education-setter.ts logic
  useEffect(() => {
    // Si pas de BAC, vider tous les champs liés au BAC
    if (bacObtention === "Non") {
      form.setValue("bacCountry", "");
      form.setValue("bacType", "");
      form.setValue("israeliBacSchool", "");
      form.setValue("frenchBacSchoolIsrael", "");
      form.setValue("otherSchoolName", "");
      form.setValue("jewishSchool", "");
      form.setValue("frenchBacSchoolFrance", "");
    }

    if (bacCountry !== "Israel") {
      form.setValue("bacType", "");
      form.setValue("israeliBacSchool", "");
      form.setValue("frenchBacSchoolIsrael", "");
      form.setValue("otherSchoolName", "");
    }

    if (bacCountry !== "Étranger") {
      form.setValue("jewishSchool", "");
      form.setValue("frenchBacSchoolFrance", "");
    }

    if (bacType !== "BAC israélien") {
      form.setValue("israeliBacSchool", "");
      form.setValue("otherSchoolName", "");
    }

    if (bacType !== "BAC étranger") {
      form.setValue("frenchBacSchoolIsrael", "");
    }

    if (jewishSchool !== "Oui") {
      form.setValue("frenchBacSchoolFrance", "");
    }

    if (academicDiploma === "Non") {
      form.setValue("higherEducationCountry", "");
      form.setValue("universityNameHebrew", "");
      form.setValue("diplomaNameHebrew", "");
      form.setValue("universityNameFrench", "");
      form.setValue("diplomaNameFrench", "");
    }

    if (higherEducationCountry !== "Israël") {
      form.setValue("universityNameHebrew", "");
      form.setValue("diplomaNameHebrew", "");
    }

    if (higherEducationCountry !== "À l'étranger") {
      form.setValue("universityNameFrench", "");
      form.setValue("diplomaNameFrench", "");
    }
  }, [
    bacObtention,
    bacCountry,
    bacType,
    jewishSchool,
    academicDiploma,
    higherEducationCountry,
    form,
  ]);

  return (
    <div className="space-y-8">
      {/* Enseignement secondaire Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Enseignement secondaire
        </h3>

        <Controller
          control={control}
          name="bacObtention"
          rules={{ required: "L'obtention du BAC est requise" }}
          render={({ field: _, fieldState }) => (
            <FormDropdown
              control={control}
              name="bacObtention"
              label="Avez-vous obtenu le BAC (israélien ou étranger) ?"
              options={EDUCATION.has_bac.map((option) => ({
                value: option.value,
                label: option.displayName,
              }))}
              required
              passDisplayName
              error={fieldState.error?.message}
            />
          )}
        />

        {bacObtention !== "Non" && (
          <Controller
            control={control}
            name="bacCountry"
            rules={{ required: "Le pays du BAC est requis" }}
            render={({ field: _, fieldState }) => (
              <FormDropdown
                control={control}
                name="bacCountry"
                label="Dans quel pays avez-vous passé/passez-vous le BAC ?"
                options={EDUCATION.bac_country.map((option) => ({
                  value: option.value,
                  label: option.displayName,
                }))}
                required
                passDisplayName
                error={fieldState.error?.message}
              />
            )}
          />
        )}

        {bacObtention !== "Non" && bacCountry === "Israel" && (
          <Controller
            control={control}
            name="bacType"
            rules={{ required: "Le type de BAC est requis" }}
            render={({ field: _, fieldState }) => (
              <FormDropdown
                control={control}
                name="bacType"
                label="Quel BAC avez-vous obtenu/êtes vous en train d'étudier ?"
                options={EDUCATION.bac_type_israel.map((option) => ({
                  value: option.value,
                  label: option.displayName,
                }))}
                required
                passDisplayName
                error={fieldState.error?.message}
              />
            )}
          />
        )}

        {bacObtention !== "Non" &&
          bacCountry === "Israel" &&
          bacType === "BAC israélien" && (
            <>
              <Controller
                control={control}
                name="israeliBacSchool"
                rules={{ required: "L'école BAC israélien est requise" }}
                render={({ field: _, fieldState }) => (
                  <FormDropdown
                    control={control}
                    name="israeliBacSchool"
                    label="J'ai obtenu/j'étudie pour mon bac israélien dans une des écoles suivantes :"
                    options={EDUCATION.israeli_bac_schools.map((option) => ({
                      value: option.value,
                      label: option.displayName,
                    }))}
                    required
                    passDisplayName
                    error={fieldState.error?.message}
                  />
                )}
              />

              {israeliBacSchool === "Autre" && (
                <Controller
                  control={control}
                  name="otherSchoolName"
                  rules={{ required: "Le nom de l'école est requis" }}
                  render={({ field: _, fieldState }) => (
                    <FormInput
                      control={control}
                      name="otherSchoolName"
                      label="Autre école"
                      required
                      error={fieldState.error?.message}
                    />
                  )}
                />
              )}
            </>
          )}

        {bacObtention !== "Non" &&
          bacCountry === "Israel" &&
          bacType === "BAC étranger" && (
            <Controller
              control={control}
              name="frenchBacSchoolIsrael"
              rules={{ required: "L'école BAC étranger est requise" }}
              render={({ field: _, fieldState }) => (
                <FormDropdown
                  control={control}
                  name="frenchBacSchoolIsrael"
                  label="J'ai obtenu/j'étudie pour mon bac étranger dans une des écoles suivantes :"
                  options={EDUCATION.foreign_bac_schools.map((option) => ({
                    value: option.value,
                    label: option.displayName,
                  }))}
                  required
                  passDisplayName
                  error={fieldState.error?.message}
                />
              )}
            />
          )}

        {bacObtention !== "Non" && bacCountry === "Étranger" && (
          <>
            <Controller
              control={control}
              name="jewishSchool"
              rules={{ required: "L'école juive est requise" }}
              render={({ field: _, fieldState }) => (
                <FormDropdown
                  control={control}
                  name="jewishSchool"
                  label="Étiez-vous en école juive ?"
                  options={EDUCATION.study_in_jewish_school.map((option) => ({
                    value: option.value,
                    label: option.displayName,
                  }))}
                  required
                  passDisplayName
                  error={fieldState.error?.message}
                />
              )}
            />

            {jewishSchool === "Oui" && (
              <Controller
                control={control}
                name="frenchBacSchoolFrance"
                rules={{ required: "Le nom de l'école juive est requis" }}
                render={({ field: _, fieldState }) => (
                  <FormInput
                    control={control}
                    name="frenchBacSchoolFrance"
                    label="Veuillez écrire le nom de l'école suivi de la ville où elle est située (exemple Yabné Paris) :"
                    required
                    error={fieldState.error?.message}
                  />
                )}
              />
            )}
          </>
        )}
      </div>

      {/* Enseignement supérieur/académique Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Enseignement supérieur/académique
        </h3>

        <Controller
          control={control}
          name="academicDiploma"
          rules={{ required: "L'obtention du diplôme supérieur est requise" }}
          render={({ field: _, fieldState }) => (
            <FormDropdown
              control={control}
              name="academicDiploma"
              label="Avez-vous obtenu un diplôme académique ou un brevet de technicien supérieur (appelé הנדסאי en hébreu) ?"
              options={EDUCATION.has_higher_education.map((option) => ({
                value: option.value,
                label: option.displayName,
              }))}
              required
              passDisplayName
              error={fieldState.error?.message}
            />
          )}
        />

        {academicDiploma !== "Non" && (
          <Controller
            control={control}
            name="higherEducationCountry"
            rules={{ required: "Le pays d'enseignement supérieur est requis" }}
            render={({ field: _, fieldState }) => (
              <FormDropdown
                control={control}
                name="higherEducationCountry"
                label="Dans quel pays avez-vous étudié/effectuez-vous vos études supérieures ?"
                options={EDUCATION.country_higher_education.map((option) => ({
                  value: option.value,
                  label: option.displayName,
                }))}
                required
                passDisplayName
                error={fieldState.error?.message}
              />
            )}
          />
        )}

        {academicDiploma !== "Non" && higherEducationCountry === "Israël" && (
          <>
            <Controller
              control={control}
              name="universityNameHebrew"
              rules={{
                required: "Le nom de l'université en hébreu est requis",
              }}
              render={({ field: _, fieldState }) => (
                <FormInput
                  control={control}
                  name="universityNameHebrew"
                  label="Veuillez écrire le nom de l'université/école en hébreu :"
                  required
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="diplomaNameHebrew"
              rules={{ required: "Le nom du diplôme en hébreu est requis" }}
              render={({ field: _, fieldState }) => (
                <FormInput
                  control={control}
                  name="diplomaNameHebrew"
                  label="Veuillez écrire le nom du diplôme en hébreu :"
                  required
                  error={fieldState.error?.message}
                />
              )}
            />
          </>
        )}

        {academicDiploma !== "Non" &&
          higherEducationCountry === "À l'étranger" && (
            <>
              <Controller
                control={control}
                name="universityNameFrench"
                rules={{
                  required: "Le nom de l'université en français est requis",
                }}
                render={({ field: _, fieldState }) => (
                  <FormInput
                    control={control}
                    name="universityNameFrench"
                    label="Veuillez écrire le nom de l'université/école en français :"
                    required
                    error={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="diplomaNameFrench"
                rules={{ required: "Le nom du diplôme en français est requis" }}
                render={({ field: _, fieldState }) => (
                  <FormInput
                    control={control}
                    name="diplomaNameFrench"
                    label="Veuillez écrire le nom du diplôme en français :"
                    required
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
