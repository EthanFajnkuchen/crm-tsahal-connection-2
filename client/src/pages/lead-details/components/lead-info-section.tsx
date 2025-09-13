import { useForm } from "react-hook-form";
import { Lead } from "@/types/lead";
import { FormInput } from "@/components/form-components/form-input";
import {
  FormSection,
  FormSubSection,
} from "@/components/form-components/form-section";
import { FormDropdown } from "@/components/form-components/form-dropdown";
import { FormDatePicker } from "@/components/form-components/form-date-picker";
import { useEffect } from "react";
import { CURRENT_STATUS } from "@/i18n/current-status";
import { STATUS_CANDIDAT } from "@/i18n/status-candidat";
import { TYPE_GIYUS } from "@/i18n/type-giyus";
import { PIKOUD } from "@/i18n/pikoud";
import { useMahzorGiyus } from "@/hooks/use-mahzor-giyus";
import { useTypeGiyus } from "@/hooks/use-type-giyus";
import { useExpertCoBadge } from "@/hooks/use-expert-co-badge";
import { TYPE_POSTE } from "@/i18n/type-poste";
import { RoleType } from "@/types/role-types";
import { ChangeRequest } from "@/types/change-request";
import { useForm as useFormLogic } from "@/hooks/use-form";
import { useUserPermissions } from "@/hooks/use-user-permissions";
import { processLeadInfoData } from "@/utils/form-data-processors";

interface LeadInfoSectionProps {
  lead: Lead;
  changeRequestsByLead: ChangeRequest[];
  isAdmin?: boolean;
  onApproveChangeRequest?: (changeRequestId: number) => void;
  onRejectChangeRequest?: (changeRequestId: number) => void;
}

export const LeadInfoSection = ({
  lead,
  changeRequestsByLead,
  isAdmin = false,
  onApproveChangeRequest,
  onRejectChangeRequest,
}: LeadInfoSectionProps) => {
  // Fields that can be modified in this section
  const fieldsToCheck = [
    "firstName",
    "lastName",
    "statutCandidat",
    "currentStatus",
    "phoneNumber",
    "whatsappNumber",
    "email",
    "mahzorGiyus",
    "typePoste",
    "soldierAloneStatus",
    "giyusDate",
    "nomPoste",
    "pikoud",
    "dateFinService",
    "mahalPath",
    "serviceType",
    "armyEntryDateStatus",
  ];

  // Date fields for proper formatting
  const dateFields = ["giyusDate", "dateFinService"];

  // Get user permissions to determine field access
  const { roleType } = useUserPermissions();

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
      armyEntryDateStatus: lead.armyEntryDateStatus,
    },
  });

  const giyusDate = watch("giyusDate");
  const mahalPath = watch("mahalPath");
  const currentStatus = watch("currentStatus");
  const serviceType = watch("serviceType");
  const statutCandidat = watch("statutCandidat");

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

  const expertCoBadge = useExpertCoBadge({
    expertConnection: lead.expertConnection,
    produitEC1: lead.produitEC1,
    produitEC2: lead.produitEC2,
    produitEC3: lead.produitEC3,
    produitEC4: lead.produitEC4,
    produitEC5: lead.produitEC5,
  });

  // Custom data processor that includes mahzorGiyus and typeGiyus
  const customDataProcessor = (data: Partial<Lead>) => {
    return processLeadInfoData(data, mahzorGiyus, typeGiyus);
  };

  // Custom original data formatter
  const originalDataFormatted = processLeadInfoData(
    lead,
    originalMahzorGiyus,
    originalTypeGiyus
  );

  // Add typeGiyus to fields if user is admin
  const adminFieldsToCheck = [
    ...fieldsToCheck,
    // Only administrators can modify typeGiyus directly
    "typeGiyus",
  ];

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
    fieldsToCheck:
      roleType[0] === RoleType.ADMINISTRATEUR
        ? adminFieldsToCheck
        : fieldsToCheck,
    dateFields,
    dataProcessor: customDataProcessor,
  });

  // Logic to determine currentStatus options and disabled state
  const getCurrentStatusConfig = () => {
    switch (statutCandidat) {
      case "À traiter":
      case "En cours de traitement":
        return {
          options: CURRENT_STATUS.all_status,
          disabled: false,
        };
      case "Dossier traité":
        return {
          options: CURRENT_STATUS.internal_status,
          disabled: false,
        };
      case "Ne répond pas / Ne sait pas":
      case "Pas de notre ressort":
        return {
          options: [],
          disabled: true,
        };
      default:
        return {
          options: CURRENT_STATUS.all_status,
          disabled: false,
        };
    }
  };

  const currentStatusConfig = getCurrentStatusConfig();

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
      armyEntryDateStatus: lead.armyEntryDateStatus,
    });
  }, [lead, reset]);

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
        title={
          <div className="flex items-center gap-2">
            {lead.firstName + " " + lead.lastName}
            {expertCoBadge}
          </div>
        }
        mode={mode}
        onModeChange={handleModeChange}
        onSave={handleSubmit(onSave)}
        onCancel={onCancel}
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
            changeRequests={changeRequestsByLead}
            onApproveChangeRequest={onApproveChangeRequest}
            onRejectChangeRequest={onRejectChangeRequest}
            isAdmin={isAdmin}
            {...getFieldProps("statutCandidat")}
          />

          <FormDropdown
            control={control}
            name="currentStatus"
            label="Situation actuelle"
            mode={mode}
            isLoading={localIsLoading}
            options={currentStatusConfig.options.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            disabled={
              currentStatusConfig.disabled ||
              getFieldProps("currentStatus").disabled
            }
            pendingChange={getFieldProps("currentStatus").pendingChange}
            pendingChangeDetails={
              getFieldProps("currentStatus").pendingChangeDetails
            }
          />

          <FormInput
            control={control}
            name="phoneNumber"
            label="Téléphone"
            mode={mode}
            isLoading={localIsLoading}
            changeRequests={changeRequestsByLead}
            onApproveChangeRequest={onApproveChangeRequest}
            onRejectChangeRequest={onRejectChangeRequest}
            isAdmin={isAdmin}
            {...getFieldProps("phoneNumber")}
          />

          <FormInput
            control={control}
            name="whatsappNumber"
            label="Whatsapp"
            mode={mode}
            isLoading={localIsLoading}
            hidden={
              mode === "VIEW" &&
              !lead.whatsappNumber &&
              !getFieldProps("whatsappNumber").pendingChange
            }
            changeRequests={changeRequestsByLead}
            onApproveChangeRequest={onApproveChangeRequest}
            onRejectChangeRequest={onRejectChangeRequest}
            isAdmin={isAdmin}
            {...getFieldProps("whatsappNumber")}
          />

          <FormInput
            control={control}
            name="email"
            label="Email"
            mode={mode}
            isLoading={localIsLoading}
            changeRequests={changeRequestsByLead}
            onApproveChangeRequest={onApproveChangeRequest}
            onRejectChangeRequest={onRejectChangeRequest}
            isAdmin={isAdmin}
            {...getFieldProps("email")}
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
            changeRequests={changeRequestsByLead}
            onApproveChangeRequest={onApproveChangeRequest}
            onRejectChangeRequest={onRejectChangeRequest}
            isAdmin={isAdmin}
            {...getFieldProps("giyusDate")}
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
            disabled={
              roleType[0] === RoleType.VOLONTAIRE ||
              getFieldProps("typeGiyus").disabled
            }
            pendingChange={getFieldProps("typeGiyus").pendingChange}
            pendingChangeDetails={
              getFieldProps("typeGiyus").pendingChangeDetails
            }
          />

          <FormDropdown
            control={control}
            name="typePoste"
            label="Type de poste"
            mode={mode}
            isLoading={localIsLoading}
            options={TYPE_POSTE.map((option) => ({
              value: option.value,
              label: option.displayName,
            }))}
            changeRequests={changeRequestsByLead}
            onApproveChangeRequest={onApproveChangeRequest}
            onRejectChangeRequest={onRejectChangeRequest}
            isAdmin={isAdmin}
            {...getFieldProps("typePoste")}
          />

          <FormInput
            control={control}
            name="nomPoste"
            label="Nom du poste"
            mode={mode}
            isLoading={localIsLoading}
            changeRequests={changeRequestsByLead}
            onApproveChangeRequest={onApproveChangeRequest}
            onRejectChangeRequest={onRejectChangeRequest}
            isAdmin={isAdmin}
            {...getFieldProps("nomPoste")}
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
            changeRequests={changeRequestsByLead}
            onApproveChangeRequest={onApproveChangeRequest}
            onRejectChangeRequest={onRejectChangeRequest}
            isAdmin={isAdmin}
            {...getFieldProps("pikoud")}
          />

          <FormDatePicker
            control={control}
            name="dateFinService"
            label="Date de fin de service"
            mode={mode}
            isLoading={localIsLoading}
            changeRequests={changeRequestsByLead}
            onApproveChangeRequest={onApproveChangeRequest}
            onRejectChangeRequest={onRejectChangeRequest}
            isAdmin={isAdmin}
            {...getFieldProps("dateFinService")}
          />
        </FormSubSection>
      </FormSection>
    </form>
  );
};
