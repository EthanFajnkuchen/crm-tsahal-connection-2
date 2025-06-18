import { useForm } from "react-hook-form";
import { Lead } from "@/types/lead";
import { FormInput } from "@/components/form-components/form-input";
import {
  FormSection,
  FormSubSection,
} from "@/components/form-components/form-section";
import { FormCheckbox } from "@/components/form-components/form-checkbox";
import { FormDropdown } from "@/components/form-components/form-dropdown";
import { FormDatePicker } from "@/components/form-components/form-date-picker";
import { RELATION } from "@/i18n/emergency-contact";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { updateLeadThunk } from "@/store/thunks/lead-details/lead-details.thunk";
import { toast } from "sonner";

interface GeneralSectionProps {
  lead: Lead;
}

export const GeneralSection = ({ lead }: GeneralSectionProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [mode, setMode] = useState<"EDIT" | "VIEW">("VIEW");
  const [localIsLoading, setLocalIsLoading] = useState(false);
  const { control, handleSubmit, reset } = useForm<Partial<Lead>>({
    defaultValues: {
      firstName: lead.firstName,
      lastName: lead.lastName,
      dateInscription: lead.dateInscription,
      birthDate: lead.birthDate,
      city: lead.city,
      gender: lead.gender || "",
      isOnlyChild: lead.isOnlyChild === "Oui" ? true : false,
      contactUrgenceFirstName: lead.contactUrgenceFirstName || "",
      contactUrgenceLastName: lead.contactUrgenceLastName || "",
      contactUrgencePhoneNumber: lead.contactUrgencePhoneNumber || "",
      contactUrgenceMail: lead.contactUrgenceMail || "",
      contactUrgenceRelation: lead.contactUrgenceRelation || "",
    },
  });

  useEffect(() => {
    reset({
      firstName: lead.firstName,
      lastName: lead.lastName,
      dateInscription: lead.dateInscription,
      birthDate: lead.birthDate,
      city: lead.city,
      gender: lead.gender || "",
      isOnlyChild: lead.isOnlyChild === "Oui" ? true : false,
      contactUrgenceFirstName: lead.contactUrgenceFirstName || "",
      contactUrgenceLastName: lead.contactUrgenceLastName || "",
      contactUrgencePhoneNumber: lead.contactUrgencePhoneNumber || "",
      contactUrgenceMail: lead.contactUrgenceMail || "",
      contactUrgenceRelation: lead.contactUrgenceRelation || "",
    });
  }, [lead, reset]);

  const handleModeChange = () => {
    setMode((prevMode) => (prevMode === "VIEW" ? "EDIT" : "VIEW"));
  };

  const handleSave = async (data: Partial<Lead>) => {
    setLocalIsLoading(true);
    try {
      const formattedData = {
        ...data,
        isOnlyChild: data.isOnlyChild ? "Oui" : "Non",
      };

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
        title="Général"
        mode={mode}
        onModeChange={handleModeChange}
        onSave={handleSubmit(handleSave)}
        onCancel={handleCancel}
        isLoading={localIsLoading}
      >
        <FormSubSection title="Informations générales">
          <FormDatePicker
            control={control}
            name="dateInscription"
            label="Date d'inscription"
            mode={mode}
            readOnly={true}
            isLoading={localIsLoading}
          />
          <FormInput
            control={control}
            name="firstName"
            label="Prénom"
            mode={mode}
            isLoading={localIsLoading}
          />
          <FormInput
            control={control}
            name="lastName"
            label="Nom"
            mode={mode}
            isLoading={localIsLoading}
          />
          <FormInput
            control={control}
            name="city"
            label="Ville"
            mode={mode}
            isLoading={localIsLoading}
          />
          <FormDropdown
            control={control}
            name="gender"
            label="Genre"
            mode={mode}
            options={[
              { value: "Masculin", label: "Masculin" },
              { value: "Féminin", label: "Féminin" },
            ]}
            isLoading={localIsLoading}
          />
          <FormDatePicker
            control={control}
            name="birthDate"
            label="Date de naissance"
            mode={mode}
            isLoading={localIsLoading}
          />
          <FormCheckbox
            control={control}
            name="isOnlyChild"
            label="Enfant unique"
            mode={mode}
            isLoading={localIsLoading}
          />
        </FormSubSection>

        <FormSubSection title="Contact d'urgence">
          <FormInput
            control={control}
            name="contactUrgenceFirstName"
            label="Prénom"
            mode={mode}
            isLoading={localIsLoading}
          />
          <FormInput
            control={control}
            name="contactUrgenceLastName"
            label="Nom"
            mode={mode}
            isLoading={localIsLoading}
          />
          <FormInput
            control={control}
            name="contactUrgencePhoneNumber"
            label="Numéro de téléphone"
            mode={mode}
            isLoading={localIsLoading}
          />
          <FormInput
            control={control}
            name="contactUrgenceMail"
            label="Email"
            mode={mode}
            isLoading={localIsLoading}
          />
          <FormDropdown
            control={control}
            name="contactUrgenceRelation"
            label="Relation"
            mode={mode}
            options={RELATION.relation.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            isLoading={localIsLoading}
          />
        </FormSubSection>
      </FormSection>
    </form>
  );
};
