import { useForm } from "react-hook-form";
import { Lead } from "@/types/lead";
import { FormInput } from "@/components/form-components/form-input";
import {
  FormSection,
  FormSubSection,
} from "@/components/form-components/form-section";
import { FormDropdown } from "@/components/form-components/form-dropdown";
import { FormDatePicker } from "@/components/form-components/form-date-picker";
import { RELATION } from "@/i18n/emergency-contact";
import { useEffect } from "react";
import { ChangeRequest } from "@/types/change-request";
import { useForm as useFormLogic } from "@/hooks/use-form";
import { processGeneralData } from "@/utils/form-data-processors";

interface GeneralSectionProps {
  lead: Lead;
  changeRequestsByLead: ChangeRequest[];
  isAdmin?: boolean;
  onApproveChangeRequest?: (changeRequestId: number) => void;
  onRejectChangeRequest?: (changeRequestId: number) => void;
}

export const GeneralSection = ({
  lead,
  changeRequestsByLead,
  isAdmin = false,
  onApproveChangeRequest,
  onRejectChangeRequest,
}: GeneralSectionProps) => {
  // Fields that can be modified in this section
  const fieldsToCheck = [
    "firstName",
    "lastName",
    "city",
    "gender",
    "birthDate",
    "isOnlyChild",
    "contactUrgenceFirstName",
    "contactUrgenceLastName",
    "contactUrgencePhoneNumber",
    "contactUrgenceMail",
    "contactUrgenceRelation",
  ];

  // Date fields for proper formatting
  const dateFields = ["birthDate", "dateInscription"];

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
    dataProcessor: processGeneralData,
  });

  const { control, handleSubmit, reset } = useForm<Partial<Lead>>({
    defaultValues: {
      firstName: lead.firstName,
      lastName: lead.lastName,
      dateInscription: lead.dateInscription,
      birthDate: lead.birthDate,
      city: lead.city,
      gender: lead.gender || "",
      isOnlyChild: lead.isOnlyChild || "",
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
      isOnlyChild: lead.isOnlyChild || "",
      contactUrgenceFirstName: lead.contactUrgenceFirstName || "",
      contactUrgenceLastName: lead.contactUrgenceLastName || "",
      contactUrgencePhoneNumber: lead.contactUrgencePhoneNumber || "",
      contactUrgenceMail: lead.contactUrgenceMail || "",
      contactUrgenceRelation: lead.contactUrgenceRelation || "",
    });
  }, [lead, reset]);

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
        title="Général"
        mode={mode}
        onModeChange={handleModeChange}
        onSave={handleSubmit(onSave)}
        onCancel={onCancel}
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
            changeRequests={changeRequestsByLead}
            onApproveChangeRequest={onApproveChangeRequest}
            onRejectChangeRequest={onRejectChangeRequest}
            isAdmin={isAdmin}
            {...getFieldProps("firstName")}
          />

          <FormInput
            control={control}
            name="lastName"
            label="Nom"
            mode={mode}
            isLoading={localIsLoading}
            changeRequests={changeRequestsByLead}
            onApproveChangeRequest={onApproveChangeRequest}
            onRejectChangeRequest={onRejectChangeRequest}
            isAdmin={isAdmin}
            {...getFieldProps("lastName")}
          />

          <FormInput
            control={control}
            name="city"
            label="Ville"
            mode={mode}
            isLoading={localIsLoading}
            changeRequests={changeRequestsByLead}
            onApproveChangeRequest={onApproveChangeRequest}
            onRejectChangeRequest={onRejectChangeRequest}
            isAdmin={isAdmin}
            {...getFieldProps("city")}
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
            changeRequests={changeRequestsByLead}
            onApproveChangeRequest={onApproveChangeRequest}
            onRejectChangeRequest={onRejectChangeRequest}
            isAdmin={isAdmin}
            {...getFieldProps("gender")}
          />

          <FormDatePicker
            control={control}
            name="birthDate"
            label="Date de naissance"
            mode={mode}
            isLoading={localIsLoading}
            changeRequests={changeRequestsByLead}
            onApproveChangeRequest={onApproveChangeRequest}
            onRejectChangeRequest={onRejectChangeRequest}
            isAdmin={isAdmin}
            {...getFieldProps("birthDate")}
          />

          <FormDropdown
            control={control}
            name="isOnlyChild"
            label="Enfant unique"
            mode={mode}
            options={[
              { value: "Oui", label: "Oui" },
              { value: "Non", label: "Non" },
            ]}
            isLoading={localIsLoading}
            changeRequests={changeRequestsByLead}
            onApproveChangeRequest={onApproveChangeRequest}
            onRejectChangeRequest={onRejectChangeRequest}
            isAdmin={isAdmin}
            {...getFieldProps("isOnlyChild")}
          />
        </FormSubSection>

        <FormSubSection title="Contact d'urgence">
          <FormInput
            control={control}
            name="contactUrgenceFirstName"
            label="Prénom"
            mode={mode}
            isLoading={localIsLoading}
            changeRequests={changeRequestsByLead}
            onApproveChangeRequest={onApproveChangeRequest}
            onRejectChangeRequest={onRejectChangeRequest}
            isAdmin={isAdmin}
            {...getFieldProps("contactUrgenceFirstName")}
          />

          <FormInput
            control={control}
            name="contactUrgenceLastName"
            label="Nom"
            mode={mode}
            isLoading={localIsLoading}
            changeRequests={changeRequestsByLead}
            onApproveChangeRequest={onApproveChangeRequest}
            onRejectChangeRequest={onRejectChangeRequest}
            isAdmin={isAdmin}
            {...getFieldProps("contactUrgenceLastName")}
          />

          <FormInput
            control={control}
            name="contactUrgencePhoneNumber"
            label="Numéro de téléphone"
            mode={mode}
            isLoading={localIsLoading}
            changeRequests={changeRequestsByLead}
            onApproveChangeRequest={onApproveChangeRequest}
            onRejectChangeRequest={onRejectChangeRequest}
            isAdmin={isAdmin}
            {...getFieldProps("contactUrgencePhoneNumber")}
          />

          <FormInput
            control={control}
            name="contactUrgenceMail"
            label="Email"
            mode={mode}
            isLoading={localIsLoading}
            changeRequests={changeRequestsByLead}
            onApproveChangeRequest={onApproveChangeRequest}
            onRejectChangeRequest={onRejectChangeRequest}
            isAdmin={isAdmin}
            {...getFieldProps("contactUrgenceMail")}
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
            changeRequests={changeRequestsByLead}
            onApproveChangeRequest={onApproveChangeRequest}
            onRejectChangeRequest={onRejectChangeRequest}
            isAdmin={isAdmin}
            {...getFieldProps("contactUrgenceRelation")}
          />
        </FormSubSection>
      </FormSection>
    </form>
  );
};
