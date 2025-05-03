import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { fetchLeadDetailsThunk } from "../../store/thunks/lead-details/lead-details.thunk";
import { RootState, AppDispatch } from "../../store/store";
import { FormInput } from "@/components/form-components/form-input";
import {
  FormSection,
  FormSubSection,
} from "@/components/form-components/form-section";
import { FormCheckbox } from "@/components/form-components/form-checkbox";
import { FormDropdown } from "@/components/form-components/form-dropdown";
import { FormDatePicker } from "@/components/form-components/form-date-picker";
import { RELATION } from "@/i18n/emergency-contact";

interface LeadFormData {
  firstName: string;
  lastName: string;
  dateInscription: string;
  birthDate: string;
  city: string;
  gender: string;
  isOnlyChild: boolean;
  contactUrgenceFirstName: string;
  contactUrgenceLastName: string;
  contactUrgencePhoneNumber: string;
  contactUrgenceMail: string;
  contactUrgenceRelation: string;
}

const LeadDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: lead,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.leadDetails);
  const [mode, setMode] = useState<"EDIT" | "VIEW">("VIEW");
  const { control, reset, handleSubmit } = useForm<LeadFormData>();

  useEffect(() => {
    if (id) {
      dispatch(fetchLeadDetailsThunk(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (lead) {
      reset({
        firstName: lead.firstName,
        lastName: lead.lastName,
        dateInscription: lead.dateInscription,
        birthDate: lead.birthDate,
        city: lead.city,
        gender: lead.gender || "",
        isOnlyChild: Boolean(lead.isOnlyChild),
        contactUrgenceFirstName: lead.contactUrgenceFirstName || "",
        contactUrgenceLastName: lead.contactUrgenceLastName || "",
        contactUrgencePhoneNumber: lead.contactUrgencePhoneNumber || "",
        contactUrgenceMail: lead.contactUrgenceMail || "",
        contactUrgenceRelation: lead.contactUrgenceRelation || "",
      });
    }
  }, [lead, reset]);

  const handleModeChange = () => {
    setMode(mode === "VIEW" ? "EDIT" : "VIEW");
  };

  const handleSave = (data: LeadFormData) => {
    console.log("Saving data:", data);
    // TODO: Implement save logic
    setMode("VIEW");
  };

  const handleCancel = () => {
    setMode("VIEW");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  if (!lead) {
    return <div className="text-center p-4">No lead found</div>;
  }

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit(handleSave)}>
        <FormSection
          title="Général"
          mode={mode}
          onModeChange={handleModeChange}
          onSave={handleSubmit(handleSave)}
          onCancel={handleCancel}
        >
          <FormSubSection title="Informations générales">
            <FormDatePicker
              control={control}
              name="dateInscription"
              label="Date d'inscription"
              mode={mode}
              readOnly={true}
            />
            <FormInput
              control={control}
              name="firstName"
              label="Prénom"
              mode={mode}
            />
            <FormInput
              control={control}
              name="lastName"
              label="Nom"
              mode={mode}
            />
            <FormInput
              control={control}
              name="city"
              label="Ville"
              mode={mode}
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
            />
            <FormDatePicker
              control={control}
              name="birthDate"
              label="Date de naissance"
              mode={mode}
            />
            <FormCheckbox
              control={control}
              name="isOnlyChild"
              label="Enfant unique"
              mode={mode}
            />
          </FormSubSection>
          <FormSubSection title="Contact d'urgence">
            <FormInput
              control={control}
              name="contactUrgenceFirstName"
              label="Prénom"
              mode={mode}
            />
            <FormInput
              control={control}
              name="contactUrgenceLastName"
              label="Nom"
              mode={mode}
            />
            <FormInput
              control={control}
              name="contactUrgencePhoneNumber"
              label="Numéro de téléphone"
              mode={mode}
            />
            <FormInput
              control={control}
              name="contactUrgenceMail"
              label="Email"
              mode={mode}
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
            />
          </FormSubSection>
        </FormSection>
      </form>
    </div>
  );
};

export default LeadDetailsPage;
