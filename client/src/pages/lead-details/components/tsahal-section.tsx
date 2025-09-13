import { useForm, useWatch } from "react-hook-form";
import { Lead } from "@/types/lead";
import {
  FormSection,
  FormSubSection,
} from "@/components/form-components/form-section";
import { FormDropdown } from "@/components/form-components/form-dropdown";
import { FormDatePicker } from "@/components/form-components/form-date-picker";
import { useEffect } from "react";
import { MILITARY } from "@/i18n/military";
import { useMahzorGiyus } from "@/hooks/use-mahzor-giyus";
import { useTypeGiyus } from "@/hooks/use-type-giyus";
import { ChangeRequest } from "@/types/change-request";
import { useForm as useFormLogic } from "@/hooks/use-form";
import { processTsahalData } from "@/utils/form-data-processors";

interface TsahalSectionProps {
  lead: Lead;
  changeRequestsByLead: ChangeRequest[];
  isAdmin?: boolean;
  onApproveChangeRequest?: (changeRequestId: number) => void;
  onRejectChangeRequest?: (changeRequestId: number) => void;
}

export const TsahalSection = ({
  lead,
  changeRequestsByLead,
  isAdmin = false,
  onApproveChangeRequest,
  onRejectChangeRequest,
}: TsahalSectionProps) => {
  // Fields that can be modified in this section
  const fieldsToCheck = [
    "currentStatus",
    "soldierAloneStatus",
    "serviceType",
    "mahalPath",
    "studyPath",
    "tsavRishonStatus",
    "recruitmentCenter",
    "tsavRishonDate",
    "tsavRishonGradesReceived",
    "daparNote",
    "medicalProfile",
    "hebrewScore",
    "yomHameaStatus",
    "yomHameaDate",
    "yomSayerotStatus",
    "yomSayerotDate",
    "armyEntryDateStatus",
    "giyusDate",
    "michveAlonTraining",
    "mahzorGiyus",
  ];

  // Date fields for proper formatting
  const dateFields = [
    "tsavRishonDate",
    "yomHameaDate",
    "yomSayerotDate",
    "giyusDate",
  ];

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

  // Watch values for conditional rendering and calculations
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

  // Calculate original values for comparison
  const originalMahzorGiyus = useMahzorGiyus(lead.giyusDate);
  const originalTypeGiyus = useTypeGiyus(
    lead.giyusDate,
    lead.mahalPath,
    lead.currentStatus,
    lead.serviceType
  );

  // Custom data processor that includes mahzorGiyus and typeGiyus
  const customDataProcessor = (data: Partial<Lead>) => {
    return processTsahalData(data, mahzorGiyus, typeGiyus);
  };

  // Custom original data formatter
  const originalDataFormatted = processTsahalData(
    lead,
    originalMahzorGiyus,
    originalTypeGiyus
  );

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
    dataProcessor: customDataProcessor,
  });

  // Wrap the handleSave function to pass reset and original data
  const onSave = (data: Partial<Lead>) => {
    handleSave(data, reset, originalDataFormatted);
  };

  // Wrap the handleCancel function to pass reset
  const onCancel = () => {
    handleCancel(reset);
  };

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <FormSection
        title="Historique militaire"
        mode={mode}
        onModeChange={handleModeChange}
        onSave={handleSubmit(onSave)}
        onCancel={onCancel}
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
            changeRequests={changeRequestsByLead}
            onApproveChangeRequest={onApproveChangeRequest}
            onRejectChangeRequest={onRejectChangeRequest}
            isAdmin={isAdmin}
            {...getFieldProps("soldierAloneStatus")}
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
            changeRequests={changeRequestsByLead}
            onApproveChangeRequest={onApproveChangeRequest}
            onRejectChangeRequest={onRejectChangeRequest}
            isAdmin={isAdmin}
            {...getFieldProps("serviceType")}
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
            changeRequests={changeRequestsByLead}
            onApproveChangeRequest={onApproveChangeRequest}
            onRejectChangeRequest={onRejectChangeRequest}
            isAdmin={isAdmin}
            {...getFieldProps("mahalPath")}
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
            hidden={serviceType !== "Études"}
            isLoading={localIsLoading}
            changeRequests={changeRequestsByLead}
            onApproveChangeRequest={onApproveChangeRequest}
            onRejectChangeRequest={onRejectChangeRequest}
            isAdmin={isAdmin}
            {...getFieldProps("studyPath")}
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
            changeRequests={changeRequestsByLead}
            onApproveChangeRequest={onApproveChangeRequest}
            onRejectChangeRequest={onRejectChangeRequest}
            isAdmin={isAdmin}
            {...getFieldProps("tsavRishonStatus")}
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
            changeRequests={changeRequestsByLead}
            onApproveChangeRequest={onApproveChangeRequest}
            onRejectChangeRequest={onRejectChangeRequest}
            isAdmin={isAdmin}
            {...getFieldProps("recruitmentCenter")}
          />

          <FormDatePicker
            control={control}
            name="tsavRishonDate"
            label="Date Tsav Rishon"
            mode={mode}
            hidden={tsavRishonStatus !== "Oui"}
            isLoading={localIsLoading}
            changeRequests={changeRequestsByLead}
            onApproveChangeRequest={onApproveChangeRequest}
            onRejectChangeRequest={onRejectChangeRequest}
            isAdmin={isAdmin}
            {...getFieldProps("tsavRishonDate")}
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
            changeRequests={changeRequestsByLead}
            onApproveChangeRequest={onApproveChangeRequest}
            onRejectChangeRequest={onRejectChangeRequest}
            isAdmin={isAdmin}
            {...getFieldProps("tsavRishonGradesReceived")}
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
            changeRequests={changeRequestsByLead}
            onApproveChangeRequest={onApproveChangeRequest}
            onRejectChangeRequest={onRejectChangeRequest}
            isAdmin={isAdmin}
            {...getFieldProps("daparNote")}
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
            changeRequests={changeRequestsByLead}
            onApproveChangeRequest={onApproveChangeRequest}
            onRejectChangeRequest={onRejectChangeRequest}
            isAdmin={isAdmin}
            {...getFieldProps("medicalProfile")}
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
            changeRequests={changeRequestsByLead}
            onApproveChangeRequest={onApproveChangeRequest}
            onRejectChangeRequest={onRejectChangeRequest}
            isAdmin={isAdmin}
            {...getFieldProps("hebrewScore")}
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
            changeRequests={changeRequestsByLead}
            onApproveChangeRequest={onApproveChangeRequest}
            onRejectChangeRequest={onRejectChangeRequest}
            isAdmin={isAdmin}
            {...getFieldProps("yomHameaStatus")}
          />

          <FormDatePicker
            control={control}
            name="yomHameaDate"
            label="Date Yom Hamea"
            mode={mode}
            hidden={yomHameaStatus !== "Oui"}
            isLoading={localIsLoading}
            changeRequests={changeRequestsByLead}
            onApproveChangeRequest={onApproveChangeRequest}
            onRejectChangeRequest={onRejectChangeRequest}
            isAdmin={isAdmin}
            {...getFieldProps("yomHameaDate")}
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
            changeRequests={changeRequestsByLead}
            onApproveChangeRequest={onApproveChangeRequest}
            onRejectChangeRequest={onRejectChangeRequest}
            isAdmin={isAdmin}
            {...getFieldProps("yomSayerotStatus")}
          />

          <FormDatePicker
            control={control}
            name="yomSayerotDate"
            label="Date Yom Sayerot"
            mode={mode}
            hidden={yomSayerotStatus !== "Oui"}
            isLoading={localIsLoading}
            changeRequests={changeRequestsByLead}
            onApproveChangeRequest={onApproveChangeRequest}
            onRejectChangeRequest={onRejectChangeRequest}
            isAdmin={isAdmin}
            {...getFieldProps("yomSayerotDate")}
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
            changeRequests={changeRequestsByLead}
            onApproveChangeRequest={onApproveChangeRequest}
            onRejectChangeRequest={onRejectChangeRequest}
            isAdmin={isAdmin}
            {...getFieldProps("armyEntryDateStatus")}
          />

          <FormDatePicker
            control={control}
            name="giyusDate"
            label="Date Giyus"
            mode={mode}
            hidden={armyEntryDateStatus !== "Oui"}
            isLoading={localIsLoading}
            changeRequests={changeRequestsByLead}
            onApproveChangeRequest={onApproveChangeRequest}
            onRejectChangeRequest={onRejectChangeRequest}
            isAdmin={isAdmin}
            {...getFieldProps("giyusDate")}
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
            changeRequests={changeRequestsByLead}
            onApproveChangeRequest={onApproveChangeRequest}
            onRejectChangeRequest={onRejectChangeRequest}
            isAdmin={isAdmin}
            {...getFieldProps("michveAlonTraining")}
          />
        </FormSubSection>
      </FormSection>
    </form>
  );
};
