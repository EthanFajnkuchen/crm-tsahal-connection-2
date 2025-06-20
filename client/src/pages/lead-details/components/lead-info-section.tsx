import { useForm } from "react-hook-form";
import { Lead } from "@/types/lead";
import { FormInput } from "@/components/form-components/form-input";
import {
  FormSection,
  FormSubSection,
} from "@/components/form-components/form-section";
import { FormDropdown } from "@/components/form-components/form-dropdown";
import { FormDatePicker } from "@/components/form-components/form-date-picker";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { updateLeadThunk } from "@/store/thunks/lead-details/lead-details.thunk";
import { toast } from "sonner";
import { CURRENT_STATUS } from "@/i18n/current-status";
import { STATUS_CANDIDAT } from "@/i18n/status-candidat";
import { TYPE_GIYUS } from "@/i18n/type-giyus";
import { PIKOUD } from "@/i18n/pikoud";
import { useMahzorGiyus } from "@/hooks/use-mahzor-giyus";
import { useTypeGiyus } from "@/hooks/use-type-giyus";

interface LeadInfoSectionProps {
  lead: Lead;
}

export const LeadInfoSection = ({ lead }: LeadInfoSectionProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [mode, setMode] = useState<"EDIT" | "VIEW">("VIEW");
  const [localIsLoading, setLocalIsLoading] = useState(false);
  const { control, handleSubmit, reset, watch } = useForm<Partial<Lead>>({
    defaultValues: {
      firstName: lead.firstName,
      lastName: lead.lastName,
      statutCandidat: lead.statutCandidat,
      currentStatus: lead.currentStatus,
      phoneNumber: lead.phoneNumber,
      whatsappNumber: lead.whatsappNumber,
      email: lead.email,
      mahzorGiyus: lead.mahzorGiyus,
      typePoste: lead.typePoste,
      soldierAloneStatus: lead.soldierAloneStatus,
      giyusDate: lead.giyusDate,
      typeGiyus: lead.typeGiyus,
      nomPoste: lead.nomPoste,
      pikoud: lead.pikoud,
      dateFinService: lead.dateFinService,
      mahalPath: lead.mahalPath,
      serviceType: lead.serviceType,
    },
  });

  const giyusDate = watch("giyusDate");
  const mahalPath = watch("mahalPath");
  const currentStatus = watch("currentStatus");
  const serviceType = watch("serviceType");

  const mahzorGiyus = useMahzorGiyus(giyusDate);
  const typeGiyus = useTypeGiyus(
    giyusDate,
    mahalPath,
    currentStatus,
    serviceType
  );

  useEffect(() => {
    reset({
      firstName: lead.firstName,
      lastName: lead.lastName,
      statutCandidat: lead.statutCandidat,
      currentStatus: lead.currentStatus,
      phoneNumber: lead.phoneNumber,
      whatsappNumber: lead.whatsappNumber,
      email: lead.email,
      mahzorGiyus: lead.mahzorGiyus,
      typePoste: lead.typePoste,
      soldierAloneStatus: lead.soldierAloneStatus,
      giyusDate: lead.giyusDate,
      typeGiyus: lead.typeGiyus,
      nomPoste: lead.nomPoste,
      pikoud: lead.pikoud,
      dateFinService: lead.dateFinService,
      mahalPath: lead.mahalPath,
      serviceType: lead.serviceType,
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
        mahzorGiyus: mahzorGiyus,
        typeGiyus: typeGiyus,
      };

      console.log(formattedData);

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
        title={lead.firstName + " " + lead.lastName}
        mode={mode}
        onModeChange={handleModeChange}
        onSave={handleSubmit(handleSave)}
        onCancel={handleCancel}
        isLoading={localIsLoading}
      >
        <FormSubSection>
          <FormDropdown
            control={control}
            name="statutCandidat"
            label="Statut candidat"
            mode={mode}
            isLoading={localIsLoading}
            options={STATUS_CANDIDAT.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
          />
          <FormDropdown
            control={control}
            name="currentStatus"
            label="Situation actuelle"
            mode={mode}
            isLoading={localIsLoading}
            options={CURRENT_STATUS.all_status.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
          />
          <FormInput
            control={control}
            name="phoneNumber"
            label="Téléphone"
            mode={mode}
            isLoading={localIsLoading}
          />
          <FormInput
            control={control}
            name="whatsappNumber"
            label="Whatsapp"
            mode={mode}
            isLoading={localIsLoading}
            hidden={mode === "VIEW" && !lead.whatsappNumber}
          />
          <FormInput
            control={control}
            name="email"
            label="Email"
            mode={mode}
            isLoading={localIsLoading}
          />
          <FormInput
            control={control}
            name="mahzorGiyus"
            label="Mahzor Giyus"
            mode={mode}
            isLoading={localIsLoading}
            readOnly={true}
          />
          <FormDatePicker
            control={control}
            name="giyusDate"
            label="Date Giyus"
            mode={mode}
            isLoading={localIsLoading}
          />
          <FormDropdown
            control={control}
            name="typeGiyus"
            label="Type Giyus"
            mode={mode}
            isLoading={localIsLoading}
            options={TYPE_GIYUS.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
          />
          <FormInput
            control={control}
            name="nomPoste"
            label="Nom du poste"
            mode={mode}
            isLoading={localIsLoading}
          />
          <FormDropdown
            control={control}
            name="pikoud"
            label="Pikoud"
            mode={mode}
            isLoading={localIsLoading}
            options={PIKOUD.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
          />
        </FormSubSection>
      </FormSection>
    </form>
  );
};
