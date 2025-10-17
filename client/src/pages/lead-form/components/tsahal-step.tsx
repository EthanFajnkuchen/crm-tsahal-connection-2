import React, { useEffect } from "react";
import { UseFormReturn, Controller, useWatch } from "react-hook-form";
import { FormDropdown } from "@/components/form-components/form-dropdown";
import { FormDatePicker } from "@/components/form-components/form-date-picker";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { LeadFormData } from "../LeadForm";
import { MILITARY } from "@/i18n/military";
import { CURRENT_STATUS } from "@/i18n/current-status";

interface TsahalStepProps {
  form: UseFormReturn<LeadFormData>;
}

export const TsahalStep: React.FC<TsahalStepProps> = ({ form }) => {
  const { control } = form;

  // Watch values for conditional rendering
  const serviceType = useWatch({ control, name: "serviceType" });
  const tsavRishonStatus = useWatch({ control, name: "tsavRishonStatus" });
  const tsavRishonGradesReceived = useWatch({
    control,
    name: "tsavRishonGradesReceived",
  });
  const yomHameaStatus = useWatch({ control, name: "yomHameaStatus" });
  const yomSayerotStatus = useWatch({ control, name: "yomSayerotStatus" });
  const armyEntryDateStatus = useWatch({
    control,
    name: "armyEntryDateStatus",
  });

  // Auto-clear fields based on tsahal-setter.ts logic
  useEffect(() => {
    // Clear mahal path if service type is not "Mahal"
    if (serviceType !== "Mahal") {
      form.setValue("mahalPath", "");
    }

    // Clear study path if service type is not "Études"
    if (serviceType !== "Études") {
      form.setValue("studyPath", "");
    }

    // Clear tsav rishon fields if status is "Non"
    if (tsavRishonStatus === "Non") {
      form.setValue("recruitmentCenter", "");
      form.setValue("tsavRishonDate", "");
      form.setValue("tsavRishonGradesReceived", "");
      form.setValue("daparNote", "");
      form.setValue("medicalProfile", "");
      form.setValue("hebrewScore", "");
    }

    // Clear grades if not received
    if (tsavRishonGradesReceived === "Non") {
      form.setValue("daparNote", "");
      form.setValue("medicalProfile", "");
      form.setValue("hebrewScore", "");
    }

    // Clear yom hamea date if status is "Non"
    if (yomHameaStatus === "Non") {
      form.setValue("yomHameaDate", "");
    }

    // Clear yom sayerot date if status is "Non"
    if (yomSayerotStatus === "Non") {
      form.setValue("yomSayerotDate", "");
    }

    // Clear army entry fields if status is "Non"
    if (armyEntryDateStatus === "Non") {
      form.setValue("giyusDate", "");
      form.setValue("michveAlonTraining", "");
    }
  }, [
    serviceType,
    tsavRishonStatus,
    tsavRishonGradesReceived,
    yomHameaStatus,
    yomSayerotStatus,
    armyEntryDateStatus,
    form,
  ]);

  return (
    <div className="space-y-8">
      {/* Situation Actuelle */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Situation Actuelle
        </h3>

        <Controller
          control={control}
          name="currentStatus"
          rules={{ required: "Le statut actuel est requis" }}
          render={({ field: _, fieldState }) => (
            <FormDropdown
              control={control}
              name="currentStatus"
              label="Je suis actuellement :"
              options={CURRENT_STATUS.current_status.map((option) => ({
                value: option.value,
                label: option.displayName,
              }))}
              required
              passDisplayName
              error={fieldState.error?.message}
            />
          )}
        />
      </div>

      {/* Historique militaire */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Historique militaire
        </h3>

        <Controller
          control={control}
          name="soldierAloneStatus"
          rules={{ required: "Le statut de soldat seul est requis" }}
          render={({ field: _, fieldState }) => (
            <FormDropdown
              control={control}
              name="soldierAloneStatus"
              label="Serez-vous un soldat seul (deux parents qui résident à l'étranger ou alors sans contact avec les parents résidant en Israël) ?"
              options={MILITARY.is_lone_solider.map((option) => ({
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
          name="serviceType"
          rules={{ required: "Le type de service est requis" }}
          render={({ field: _, fieldState }) => (
            <FormDropdown
              control={control}
              name="serviceType"
              label="Quel est le type de service que vous souhaitez effectuer ?"
              options={MILITARY.service_type.map((option) => ({
                value: option.value,
                label: option.displayName,
              }))}
              required
              passDisplayName
              error={fieldState.error?.message}
            />
          )}
        />

        {serviceType === "Mahal" && (
          <Controller
            control={control}
            name="mahalPath"
            rules={{ required: "Le parcours Mahal est requis" }}
            render={({ field: _, fieldState }) => (
              <FormDropdown
                control={control}
                name="mahalPath"
                label="Quel est le parcours Mahal qui vous intéresse ?"
                options={MILITARY.mahal_type.map((option) => ({
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

        {serviceType === "Études" && (
          <Controller
            control={control}
            name="studyPath"
            rules={{ required: "Le parcours d'études est requis" }}
            render={({ field: _, fieldState }) => (
              <FormDropdown
                control={control}
                name="studyPath"
                label="Quel est le parcours d'études qui vous intéresse ?"
                options={MILITARY.study_type.map((option) => ({
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

        <Controller
          control={control}
          name="tsavRishonStatus"
          rules={{ required: "Le statut du Tsav Rishon est requis" }}
          render={({ field: _, fieldState }) => (
            <FormDropdown
              control={control}
              name="tsavRishonStatus"
              label="Avez-vous fait/Avez-vous reçu une convocation pour le Tsav Rishon (première convocation reçue par Tsahal) ?"
              options={MILITARY.has_received_tsav_rishon.map((option) => ({
                value: option.value,
                label: option.displayName,
              }))}
              required
              passDisplayName
              error={fieldState.error?.message}
            />
          )}
        />

        {tsavRishonStatus === "Oui" && (
          <>
            <Controller
              control={control}
              name="recruitmentCenter"
              rules={{ required: "Le centre de recrutement est requis" }}
              render={({ field: _, fieldState }) => (
                <FormDropdown
                  control={control}
                  name="recruitmentCenter"
                  label="Dans quel centre de recrutement se déroulera/s'est déroulé votre Tsav Rishon ?"
                  options={MILITARY.recruitment_center_tsav_rishon.map(
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

            <Controller
              control={control}
              name="tsavRishonDate"
              rules={{ required: "La date du Tsav Rishon est requise" }}
              render={({ field: _, fieldState }) => (
                <FormDatePicker
                  control={control as any}
                  name="tsavRishonDate"
                  label="Date de votre Tsav Rishon (Indiqué sur le papier de la convocation ou sur le site Mitgaisim) :"
                  required
                  allowFuture
                  maxFutureYears={6}
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="tsavRishonGradesReceived"
              rules={{ required: "Le statut des notes est requis" }}
              render={({ field: _, fieldState }) => (
                <FormDropdown
                  control={control}
                  name="tsavRishonGradesReceived"
                  label="Avez-vous reçu vos notes du Tsav Rishon ?"
                  options={MILITARY.has_received_tsav_rishon_grade.map(
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

            {tsavRishonGradesReceived === "Oui" && (
              <>
                <Controller
                  control={control}
                  name="daparNote"
                  render={({ field: _, fieldState }) => (
                    <FormDropdown
                      control={control}
                      name="daparNote"
                      label="Quel est votre note au Dapar ?"
                      options={MILITARY.dapar_grades.map((option) => ({
                        value: option.value.toString(),
                        label: option.displayName,
                      }))}
                      passDisplayName
                      error={fieldState.error?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="medicalProfile"
                  render={({ field: _, fieldState }) => (
                    <FormDropdown
                      control={control}
                      name="medicalProfile"
                      label="Quel est votre profil médical ?"
                      options={MILITARY.medical_profile.map((option) => ({
                        value: option.value.toString(),
                        label: option.displayName,
                      }))}
                      passDisplayName
                      error={fieldState.error?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="hebrewScore"
                  render={({ field: _, fieldState }) => (
                    <FormDropdown
                      control={control}
                      name="hebrewScore"
                      label="Quel est votre simoul ivrit (note d'hébreu affiché sur le site) ?"
                      options={MILITARY.hebrew_grade.map((option) => ({
                        value: option.value.toString(),
                        label: option.displayName,
                      }))}
                      passDisplayName
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </>
            )}
          </>
        )}

        <Controller
          control={control}
          name="yomHameaStatus"
          rules={{ required: "Le statut du Yom Hamea est requis" }}
          render={({ field: _, fieldState }) => (
            <FormDropdown
              control={control}
              name="yomHameaStatus"
              label="Avez-vous fait/Avez-vous reçu une convocation pour le Yom Hamea ?"
              options={MILITARY.has_received_yom_hameah.map((option) => ({
                value: option.value,
                label: option.displayName,
              }))}
              required
              passDisplayName
              error={fieldState.error?.message}
            />
          )}
        />

        {yomHameaStatus === "Oui" && (
          <Controller
            control={control}
            name="yomHameaDate"
            rules={{ required: "La date du Yom Hamea est requise" }}
            render={({ field: _, fieldState }) => (
              <FormDatePicker
                control={control as any}
                name="yomHameaDate"
                label="Date de votre Yom Hamea (Indiqué sur le papier de la convocation ou sur le site Mitgaisim) :"
                required
                allowFuture
                maxFutureYears={6}
                error={fieldState.error?.message}
              />
            )}
          />
        )}

        <Controller
          control={control}
          name="yomSayerotStatus"
          rules={{ required: "Le statut du Yom Sayerot est requis" }}
          render={({ field: _, fieldState }) => (
            <FormDropdown
              control={control}
              name="yomSayerotStatus"
              label="Avez-vous fait/Avez-vous reçu une convocation pour le Yom Sayerot ?"
              options={MILITARY.has_received_yom_sayerot.map((option) => ({
                value: option.value,
                label: option.displayName,
              }))}
              required
              passDisplayName
              error={fieldState.error?.message}
            />
          )}
        />

        {yomSayerotStatus === "Oui" && (
          <Controller
            control={control}
            name="yomSayerotDate"
            rules={{ required: "La date du Yom Sayerot est requise" }}
            render={({ field: _, fieldState }) => (
              <FormDatePicker
                control={control as any}
                name="yomSayerotDate"
                label="Date de votre Yom Sayerot (Indiqué sur le papier de la convocation ou sur le site Mitgaisim) :"
                required
                allowFuture
                maxFutureYears={6}
                error={fieldState.error?.message}
              />
            )}
          />
        )}

        <Controller
          control={control}
          name="armyEntryDateStatus"
          rules={{ required: "Le statut de la date d'entrée est requis" }}
          render={({ field: _, fieldState }) => (
            <FormDropdown
              control={control}
              name="armyEntryDateStatus"
              label="Avez-vous reçu une date d'entrée officiel à l'armée ?"
              options={MILITARY.has_received_giyus_date.map((option) => ({
                value: option.value,
                label: option.displayName,
              }))}
              required
              passDisplayName
              error={fieldState.error?.message}
            />
          )}
        />

        {armyEntryDateStatus === "Oui" && (
          <>
            <Controller
              control={control}
              name="giyusDate"
              rules={{ required: "La date de Giyus est requise" }}
              render={({ field: _, fieldState }) => (
                <FormDatePicker
                  control={control as any}
                  name="giyusDate"
                  label="Date de votre incorporation (Giyus) à Tsahal :"
                  required
                  allowFuture
                  maxFutureYears={6}
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="michveAlonTraining"
              rules={{ required: "Le programme Michve Alon est requis" }}
              render={({ field: _, fieldState }) => (
                <FormDropdown
                  control={control}
                  name="michveAlonTraining"
                  label="Quel programme allez-vous suivre à Michve Alon ?"
                  options={MILITARY.program_at_michve_alon.map((option) => ({
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

        {/* Résumé */}
        <div className="space-y-2">
          <Label
            htmlFor="summary"
            className="text-sm text-gray-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-[Poppins] flex items-center gap-2"
          >
            <span>
              Résumé en quelques lignes votre parcours jusqu'à présent
              (scolarité, lien à la communauté juive et à Israël, motivation
              pour l'armée, hobbies, types d'aides dont vous avez besoin etc...)
              :
            </span>
            <span className="text-red-500">*</span>
          </Label>
          <Controller
            control={control}
            name="summary"
            rules={{ required: "Le résumé est requis" }}
            render={({ field, fieldState }) => (
              <div>
                <Textarea
                  {...field}
                  id="summary"
                  placeholder="Décrivez votre parcours..."
                  className="min-h-[120px]"
                />
                {fieldState.error && (
                  <p className="text-sm text-red-500 mt-1">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        {/* Checkbox termes et conditions */}
        <div className="space-y-2">
          <Controller
            control={control}
            name="acceptTerms"
            rules={{ required: "Vous devez accepter les termes et conditions" }}
            render={({ field, fieldState }) => (
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="acceptTerms"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="mt-0"
                />
                <div className="space-y-1">
                  <Label
                    htmlFor="acceptTerms"
                    className="text-sm text-gray-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-[Poppins] flex items-center gap-2"
                  >
                    <span>J'accepte les </span>
                    <a
                      href="https://www.tsahalco.com/mentions-legales"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      termes et conditions
                    </a>
                    <span className="text-red-500">*</span>
                  </Label>
                  {fieldState.error && (
                    <p className="text-sm text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
};
