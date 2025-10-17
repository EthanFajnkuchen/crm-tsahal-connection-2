import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormInput } from "@/components/form-components/form-input";
import { FormDropdown } from "@/components/form-components/form-dropdown";
import { FormDatePicker } from "@/components/form-components/form-date-picker";
import { PhoneInput } from "@/components/form-components/phone-input";
import { FormCheckbox } from "@/components/form-components/form-checkbox";
import { LeadFormData } from "../LeadForm";
import { RELATION } from "@/i18n/emergency-contact";
import { Controller } from "react-hook-form";
import { useEmailValidation } from "@/hooks/use-email-validation";

interface GeneralStepProps {
  form: UseFormReturn<LeadFormData>;
}

export const GeneralStep: React.FC<GeneralStepProps> = ({ form }) => {
  const { control, watch, setValue } = form;

  const whatsappSameAsPhone = watch("whatsappSameAsPhone");
  // Email validation hook
  const {
    validateEmail,
    resetValidation,
    isValid: isEmailValid,
    isLoading: isValidatingEmail,
    error: emailValidationError,
    hasBeenValidated,
  } = useEmailValidation();

  // Update WhatsApp number when checkbox is checked
  React.useEffect(() => {
    if (whatsappSameAsPhone) {
      setValue("whatsappNumber", "");
      setValue("confirmWhatsappNumber", "");
    }
  }, [whatsappSameAsPhone, setValue]);

  // Handle email validation on blur
  const handleEmailBlur = React.useCallback(
    async (email: string) => {
      if (email && email.includes("@")) {
        await validateEmail(email);
      } else {
        resetValidation();
      }
    },
    [validateEmail, resetValidation]
  );

  // Handle email change to reset validation state when user starts typing
  const handleEmailChange = React.useCallback(() => {
    if (emailValidationError) {
      resetValidation();
    }
  }, [emailValidationError, resetValidation]);

  return (
    <div className="space-y-8">
      {/* Personal Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Informations personnelles
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            control={control}
            name="firstName"
            rules={{ required: "Le prénom est requis" }}
            render={({ fieldState }) => (
              <FormInput
                control={control}
                name="firstName"
                label="Prénom(s)"
                required
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="lastName"
            rules={{ required: "Le nom de famille est requis" }}
            render={({ fieldState }) => (
              <FormInput
                control={control}
                name="lastName"
                label="Nom(s) de famille"
                required
                error={fieldState.error?.message}
              />
            )}
          />
        </div>

        <Controller
          control={control}
          name="birthDate"
          rules={{ required: "La date de naissance est requise" }}
          render={({ fieldState }) => (
            <FormDatePicker
              control={control as any}
              name="birthDate"
              label="Date de naissance"
              required
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="gender"
          rules={{ required: "Le genre est requis" }}
          render={({ fieldState }) => (
            <FormDropdown
              control={control}
              name="gender"
              label="Genre"
              options={[
                { value: "Masculin", label: "Masculin" },
                { value: "Féminin", label: "Féminin" },
              ]}
              required
              error={fieldState.error?.message}
            />
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            control={control}
            name="email"
            rules={{
              required: "L'email est requis",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Format d'email invalide",
              },
            }}
            render={({ field, fieldState }) => (
              <FormInput
                control={control}
                name="email"
                label="Email"
                type="email"
                required
                error={fieldState.error?.message}
                isValidatingEmail={isValidatingEmail}
                isEmailValid={isEmailValid}
                emailValidationError={emailValidationError || undefined}
                hasBeenValidated={hasBeenValidated}
                onChange={(e) => {
                  field.onChange(e);
                  handleEmailChange();
                }}
                onBlur={(e) => {
                  field.onBlur();
                  handleEmailBlur(e.target.value);
                }}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmEmail"
            rules={{
              required: "La confirmation de l'email est requise",
              validate: (value) =>
                value === watch("email") || "Les emails ne correspondent pas",
            }}
            render={({ fieldState }) => (
              <FormInput
                control={control}
                name="confirmEmail"
                label="Confirmez votre email"
                type="email"
                required
                error={fieldState.error?.message}
              />
            )}
          />
        </div>

        <div className="space-y-4">
          <Controller
            control={control}
            name="phoneNumber"
            rules={{
              required: "Le numéro de téléphone est requis",
              minLength: {
                value: 10,
                message: "Le numéro doit contenir au moins 10 chiffres",
              },
            }}
            render={({ field, fieldState }) => (
              <PhoneInput
                value={field.value || ""}
                onChange={field.onChange}
                label="Téléphone mobile"
                placeholder="Numéro de téléphone"
                required
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPhoneNumber"
            rules={{
              required: "La confirmation du numéro est requise",
              validate: (value) =>
                value === watch("phoneNumber") ||
                "Les numéros ne correspondent pas",
            }}
            render={({ field, fieldState }) => (
              <PhoneInput
                value={field.value || ""}
                onChange={field.onChange}
                label="Confirmez votre numéro"
                placeholder="Confirmez votre numéro"
                required
                error={fieldState.error?.message}
              />
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <FormCheckbox
              control={control}
              name="whatsappSameAsPhone"
              label="Mon numéro de téléphone WhatsApp est le même"
            />
          </div>

          {!whatsappSameAsPhone && (
            <>
              <Controller
                control={control}
                name="whatsappNumber"
                rules={{
                  required: !whatsappSameAsPhone
                    ? "Le numéro WhatsApp est requis"
                    : false,
                  minLength: !whatsappSameAsPhone
                    ? {
                        value: 10,
                        message: "Le numéro doit contenir au moins 10 chiffres",
                      }
                    : undefined,
                }}
                render={({ field, fieldState }) => (
                  <PhoneInput
                    key={`whatsapp-${whatsappSameAsPhone}`}
                    value={field.value || ""}
                    onChange={field.onChange}
                    label="Numéro WhatsApp"
                    placeholder="Numéro WhatsApp"
                    required={!whatsappSameAsPhone}
                    error={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="confirmWhatsappNumber"
                rules={{
                  required: !whatsappSameAsPhone
                    ? "La confirmation du numéro WhatsApp est requise"
                    : false,
                  validate: !whatsappSameAsPhone
                    ? (value) =>
                        value === watch("whatsappNumber") ||
                        "Les numéros WhatsApp ne correspondent pas"
                    : undefined,
                }}
                render={({ field, fieldState }) => (
                  <PhoneInput
                    key={`confirm-whatsapp-${whatsappSameAsPhone}`}
                    value={field.value || ""}
                    onChange={field.onChange}
                    label="Confirmez votre numéro WhatsApp"
                    placeholder="Confirmez votre numéro WhatsApp"
                    required={!whatsappSameAsPhone}
                    error={fieldState.error?.message}
                  />
                )}
              />
            </>
          )}
        </div>

        <Controller
          control={control}
          name="city"
          rules={{ required: "La ville de résidence est requise" }}
          render={({ fieldState }) => (
            <FormInput
              control={control}
              name="city"
              label="Ville de résidence"
              required
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="isOnlyChild"
          rules={{ required: "Cette information est requise" }}
          render={({ fieldState }) => (
            <FormDropdown
              control={control}
              name="isOnlyChild"
              label="Êtes-vous enfant unique (ne pas avoir un frère ou une sœur des mêmes parents) ?"
              options={[
                { value: "Oui", label: "Oui" },
                { value: "Non", label: "Non" },
              ]}
              required
              error={fieldState.error?.message}
            />
          )}
        />
      </div>

      {/* Emergency Contact */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Contact d'urgence
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            control={control}
            name="contactUrgenceFirstName"
            rules={{ required: "Le prénom du contact d'urgence est requis" }}
            render={({ fieldState }) => (
              <FormInput
                control={control}
                name="contactUrgenceFirstName"
                label="Prénom(s)"
                required
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="contactUrgenceLastName"
            rules={{ required: "Le nom du contact d'urgence est requis" }}
            render={({ fieldState }) => (
              <FormInput
                control={control}
                name="contactUrgenceLastName"
                label="Nom(s) de famille"
                required
                error={fieldState.error?.message}
              />
            )}
          />
        </div>

        <div className="space-y-4">
          <Controller
            control={control}
            name="contactUrgencePhoneNumber"
            rules={{
              required:
                "Le numéro de téléphone du contact d'urgence est requis",
              minLength: {
                value: 10,
                message: "Le numéro doit contenir au moins 10 chiffres",
              },
            }}
            render={({ field, fieldState }) => (
              <PhoneInput
                value={field.value || ""}
                onChange={field.onChange}
                label="Téléphone mobile"
                placeholder="Numéro du contact d'urgence"
                required
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmContactUrgencePhoneNumber"
            rules={{
              required: "La confirmation du numéro est requise",
              validate: (value) =>
                value === watch("contactUrgencePhoneNumber") ||
                "Les numéros ne correspondent pas",
            }}
            render={({ field, fieldState }) => (
              <PhoneInput
                value={field.value || ""}
                onChange={field.onChange}
                label="Confirmez votre numéro"
                placeholder="Confirmez le numéro"
                required
                error={fieldState.error?.message}
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            control={control}
            name="contactUrgenceEmail"
            rules={{
              required: "L'email du contact d'urgence est requis",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Format d'email invalide",
              },
            }}
            render={({ fieldState }) => (
              <FormInput
                control={control}
                name="contactUrgenceEmail"
                label="Email"
                type="email"
                required
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmContactUrgenceEmail"
            rules={{
              required: "La confirmation de l'email est requise",
              validate: (value) =>
                value === watch("contactUrgenceEmail") ||
                "Les emails ne correspondent pas",
            }}
            render={({ fieldState }) => (
              <FormInput
                control={control}
                name="confirmContactUrgenceEmail"
                label="Confirmez votre email"
                type="email"
                required
                error={fieldState.error?.message}
              />
            )}
          />
        </div>

        <Controller
          control={control}
          name="contactUrgenceRelation"
          rules={{ required: "Le lien avec le contact d'urgence est requis" }}
          render={({ fieldState }) => (
            <FormDropdown
              control={control}
              name="contactUrgenceRelation"
              label="Lien"
              options={RELATION.relation.map((option) => ({
                value: option.value,
                label: option.displayName,
              }))}
              required
              error={fieldState.error?.message}
            />
          )}
        />
      </div>
    </div>
  );
};
