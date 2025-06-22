import { useForm, useWatch } from "react-hook-form";
import { Lead } from "@/types/lead";
import {
  FormSection,
  FormSubSection,
} from "@/components/form-components/form-section";
import { FormDropdown } from "@/components/form-components/form-dropdown";
import { FormDatePicker } from "@/components/form-components/form-date-picker";
import { useState, useEffect } from "react";
import { MILITARY } from "@/i18n/military";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { updateLeadThunk } from "@/store/thunks/lead-details/lead-details.thunk";
import { toast } from "sonner";
import { processTsahalData } from "../setters/tsahal-setter";
import { useMahzorGiyus } from "@/hooks/use-mahzor-giyus";
import { useTypeGiyus } from "@/hooks/use-type-giyus";

interface TsahalSectionProps {
  lead: Lead;
}

export const TsahalSection = ({ lead }: TsahalSectionProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [mode, setMode] = useState<"EDIT" | "VIEW">("VIEW");
  const [localIsLoading, setLocalIsLoading] = useState(false);
  const { control, handleSubmit, reset } = useForm<Partial<Lead>>({
    defaultValues: {
      currentStatus: lead.currentStatus || "",
      soldierAloneStatus: lead.soldierAloneStatus || "",
      serviceType: lead.serviceType || "",
      mahalPath: lead.mahalPath || "",
      studyPath: lead.studyPath || "",
      tsavRishonStatus: lead.tsavRishonStatus || "",
      recruitmentCenter: lead.recruitmentCenter || "",
      tsavRishonDate: lead.tsavRishonDate || "",
      tsavRishonGradesReceived: lead.tsavRishonGradesReceived || "",
      daparNote: lead.daparNote || "",
      medicalProfile: lead.medicalProfile || "",
      hebrewScore: lead.hebrewScore || "",
      yomHameaStatus: lead.yomHameaStatus || "",
      yomHameaDate: lead.yomHameaDate || "",
      yomSayerotStatus: lead.yomSayerotStatus || "",
      yomSayerotDate: lead.yomSayerotDate || "",
      armyEntryDateStatus: lead.armyEntryDateStatus || "",
      giyusDate: lead.giyusDate || "",
      michveAlonTraining: lead.michveAlonTraining || "",
      mahzorGiyus: lead.mahzorGiyus || "",
    },
  });

  useEffect(() => {
    reset({
      currentStatus: lead.currentStatus || "",
      soldierAloneStatus: lead.soldierAloneStatus || "",
      serviceType: lead.serviceType || "",
      mahalPath: lead.mahalPath || "",
      studyPath: lead.studyPath || "",
      tsavRishonStatus: lead.tsavRishonStatus || "",
      recruitmentCenter: lead.recruitmentCenter || "",
      tsavRishonDate: lead.tsavRishonDate || "",
      tsavRishonGradesReceived: lead.tsavRishonGradesReceived || "",
      daparNote: lead.daparNote || "",
      medicalProfile: lead.medicalProfile || "",
      hebrewScore: lead.hebrewScore || "",
      yomHameaStatus: lead.yomHameaStatus || "",
      yomHameaDate: lead.yomHameaDate || "",
      yomSayerotStatus: lead.yomSayerotStatus || "",
      yomSayerotDate: lead.yomSayerotDate || "",
      armyEntryDateStatus: lead.armyEntryDateStatus || "",
      giyusDate: lead.giyusDate || "",
      michveAlonTraining: lead.michveAlonTraining || "",
      mahzorGiyus: lead.mahzorGiyus || "",
    });
  }, [lead, reset]);

  const serviceType = useWatch({
    control,
    name: "serviceType",
  });

  const tsavRishonStatus = useWatch({
    control,
    name: "tsavRishonStatus",
  });

  const tsavRishonGradesReceived = useWatch({
    control,
    name: "tsavRishonGradesReceived",
  });

  const yomHameaStatus = useWatch({
    control,
    name: "yomHameaStatus",
  });

  const yomSayerotStatus = useWatch({
    control,
    name: "yomSayerotStatus",
  });

  const armyEntryDateStatus = useWatch({
    control,
    name: "armyEntryDateStatus",
  });

  const giyusDate = useWatch({
    control,
    name: "giyusDate",
  });

  const mahalPath = useWatch({
    control,
    name: "mahalPath",
  });
  const currentStatus = useWatch({
    control,
    name: "currentStatus",
  });

  const mahzorGiyus = useMahzorGiyus(giyusDate);
  const typeGiyus = useTypeGiyus(
    giyusDate,
    mahalPath,
    currentStatus,
    serviceType
  );

  const handleModeChange = () => {
    setMode((prevMode) => (prevMode === "VIEW" ? "EDIT" : "VIEW"));
  };

  const handleSave = async (data: Partial<Lead>) => {
    setLocalIsLoading(true);
    const processedData = processTsahalData(data, mahzorGiyus, typeGiyus);
    try {
      await dispatch(
        updateLeadThunk({
          id: lead.ID.toString(),
          updateData: processedData,
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
        title="Historique militaire"
        mode={mode}
        onModeChange={handleModeChange}
        onSave={handleSubmit(handleSave)}
        onCancel={handleCancel}
        isLoading={localIsLoading}
      >
        <FormSubSection>
          <FormDropdown
            control={control}
            name="soldierAloneStatus"
            label="Soldat seul"
            mode={mode}
            options={MILITARY.is_lone_solider.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            isLoading={localIsLoading}
          />
          <FormDropdown
            control={control}
            name="serviceType"
            label="Type de service"
            mode={mode}
            options={MILITARY.service_type.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            isLoading={localIsLoading}
          />
          <FormDropdown
            control={control}
            name="mahalPath"
            label="Parcours Mahal"
            mode={mode}
            options={MILITARY.mahal_type.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            hidden={serviceType !== "Mahal"}
            isLoading={localIsLoading}
          />
          <FormDropdown
            control={control}
            name="studyPath"
            label="Parcours d'études"
            mode={mode}
            options={MILITARY.study_type.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            hidden={serviceType !== "Service complet"}
            isLoading={localIsLoading}
          />
          <FormDropdown
            control={control}
            name="tsavRishonStatus"
            label="Convocation Tsav Rishon"
            mode={mode}
            options={MILITARY.has_received_tsav_rishon.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            isLoading={localIsLoading}
          />
          <FormDropdown
            control={control}
            name="recruitmentCenter"
            label="Centre de recrutement"
            mode={mode}
            options={MILITARY.recruitment_center_tsav_rishon.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            hidden={tsavRishonStatus !== "Oui"}
            isLoading={localIsLoading}
          />
          <FormDatePicker
            control={control}
            name="tsavRishonDate"
            label="Date Tsav Rishon"
            mode={mode}
            hidden={tsavRishonStatus !== "Oui"}
            isLoading={localIsLoading}
          />
          <FormDropdown
            control={control}
            name="tsavRishonGradesReceived"
            label="Notes Tsav Rishon"
            mode={mode}
            options={MILITARY.has_received_tsav_rishon_grade.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            hidden={tsavRishonStatus !== "Oui"}
            isLoading={localIsLoading}
          />
          <FormDropdown
            control={control}
            name="daparNote"
            label="Note Dapar"
            mode={mode}
            options={MILITARY.dapar_grades.map((option) => ({
              value: option.value.toString(),
              label: option.displayName,
            }))}
            hidden={tsavRishonGradesReceived !== "Oui"}
            isLoading={localIsLoading}
          />
          <FormDropdown
            control={control}
            name="medicalProfile"
            label="Profil médical"
            mode={mode}
            options={MILITARY.medical_profile.map((option) => ({
              value: option.value.toString(),
              label: option.displayName,
            }))}
            hidden={tsavRishonGradesReceived !== "Oui"}
            isLoading={localIsLoading}
          />
          <FormDropdown
            control={control}
            name="hebrewScore"
            label="Simoul Ivrit"
            mode={mode}
            options={MILITARY.hebrew_grade.map((option) => ({
              value: option.value.toString(),
              label: option.displayName,
            }))}
            hidden={tsavRishonGradesReceived !== "Oui"}
            isLoading={localIsLoading}
          />
          <FormDropdown
            control={control}
            name="yomHameaStatus"
            label="Yom Hamea"
            mode={mode}
            options={MILITARY.has_received_yom_hameah.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            isLoading={localIsLoading}
          />
          <FormDatePicker
            control={control}
            name="yomHameaDate"
            label="Date Yom Hamea"
            mode={mode}
            hidden={yomHameaStatus !== "Oui"}
            isLoading={localIsLoading}
          />
          <FormDropdown
            control={control}
            name="yomSayerotStatus"
            label="Yom Sayerot"
            mode={mode}
            options={MILITARY.has_received_yom_sayerot.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            isLoading={localIsLoading}
          />
          <FormDatePicker
            control={control}
            name="yomSayerotDate"
            label="Date Yom Sayerot"
            mode={mode}
            hidden={yomSayerotStatus !== "Oui"}
            isLoading={localIsLoading}
          />
          <FormDropdown
            control={control}
            name="armyEntryDateStatus"
            label="Date d'entrée dans l'armée"
            mode={mode}
            options={MILITARY.has_received_giyus_date.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            isLoading={localIsLoading}
          />
          <FormDatePicker
            control={control}
            name="giyusDate"
            label="Date Giyus"
            mode={mode}
            hidden={armyEntryDateStatus !== "Oui"}
            isLoading={localIsLoading}
          />
          <FormDropdown
            control={control}
            name="michveAlonTraining"
            label="Michve Alon"
            mode={mode}
            options={MILITARY.program_at_michve_alon.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            hidden={armyEntryDateStatus !== "Oui"}
            isLoading={localIsLoading}
          />
        </FormSubSection>
      </FormSection>
    </form>
  );
};
