import { useForm, Controller } from "react-hook-form";
import { Lead } from "@/types/lead";
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
import { processExpertConnectionData } from "../setters/expert-connection-setter";

interface ExpertConnectionSectionProps {
  lead: Lead;
}

const expertConnectionOptions = [
  { value: "Suivi Massa", label: "Suivi Massa" },
  { value: "Suivi Classique", label: "Suivi Classique" },
  { value: "Suivi Expert", label: "Suivi Expert" },
  { value: "Entretien individuel", label: "Entretien individuel" },
  {
    value: "Simulation Tsav Rishon/Yom Hamea",
    label: "Simulation Tsav Rishon/Yom Hamea",
  },
  {
    value: "Evaluation physique & mentale",
    label: "Evaluation physique & mentale",
  },
  {
    value: "Orientation individuelle sur les postes",
    label: "Orientation individuelle sur les postes",
  },
];

export const ExpertConnectionSection = ({
  lead,
}: ExpertConnectionSectionProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [mode, setMode] = useState<"EDIT" | "VIEW">("VIEW");
  const [localIsLoading, setLocalIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<Partial<Lead>>({
    mode: "onChange",
    defaultValues: {
      expertConnection: lead.expertConnection || "",
      produitEC1: lead.produitEC1 || "",
      produitEC2: lead.produitEC2 || "",
      produitEC3: lead.produitEC3 || "",
      produitEC4: lead.produitEC4 || "",
      produitEC5: lead.produitEC5 || "",
      dateProduitEC1: lead.dateProduitEC1 || "",
      dateProduitEC2: lead.dateProduitEC2 || "",
      dateProduitEC3: lead.dateProduitEC3 || "",
      dateProduitEC4: lead.dateProduitEC4 || "",
      dateProduitEC5: lead.dateProduitEC5 || "",
    },
  });

  // Mettre à jour les valeurs du formulaire quand le lead change
  useEffect(() => {
    reset({
      expertConnection: lead.expertConnection || "",
      produitEC1: lead.produitEC1 || "",
      produitEC2: lead.produitEC2 || "",
      produitEC3: lead.produitEC3 || "",
      produitEC4: lead.produitEC4 || "",
      produitEC5: lead.produitEC5 || "",
      dateProduitEC1: lead.dateProduitEC1 || "",
      dateProduitEC2: lead.dateProduitEC2 || "",
      dateProduitEC3: lead.dateProduitEC3 || "",
      dateProduitEC4: lead.dateProduitEC4 || "",
      dateProduitEC5: lead.dateProduitEC5 || "",
    });
  }, [lead, reset]);

  const expertConnection = watch("expertConnection");
  const produitEC1 = watch("produitEC1");
  const dateProduitEC1 = watch("dateProduitEC1");
  const produitEC2 = watch("produitEC2");
  const dateProduitEC2 = watch("dateProduitEC2");
  const produitEC3 = watch("produitEC3");
  const dateProduitEC3 = watch("dateProduitEC3");
  const produitEC4 = watch("produitEC4");
  const dateProduitEC4 = watch("dateProduitEC4");
  const produitEC5 = watch("produitEC5");
  const dateProduitEC5 = watch("dateProduitEC5");

  // Helper function to determine if a field is required
  const isFieldRequired = (fieldName: string) => {
    switch (fieldName) {
      case "produitEC1":
        return expertConnection === "Oui";
      case "dateProduitEC1":
        return expertConnection === "Oui" || !!produitEC1;
      case "produitEC2":
        return !!dateProduitEC2;
      case "dateProduitEC2":
        return !!produitEC2;
      case "produitEC3":
        return !!dateProduitEC3;
      case "dateProduitEC3":
        return !!produitEC3;
      case "produitEC4":
        return !!dateProduitEC4;
      case "dateProduitEC4":
        return !!produitEC4;
      case "produitEC5":
        return !!dateProduitEC5;
      case "dateProduitEC5":
        return !!produitEC5;
      default:
        return false;
    }
  };

  const handleModeChange = () => {
    setMode("EDIT");
  };

  const handleSave = async (data: Partial<Lead>) => {
    setLocalIsLoading(true);
    const processedData = processExpertConnectionData(data);
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
        title="Expert Connection"
        mode={mode}
        onModeChange={handleModeChange}
        onSave={handleSubmit(handleSave)}
        onCancel={handleCancel}
        isLoading={localIsLoading}
        saveDisabled={!isValid}
      >
        <FormSubSection>
          <FormDropdown
            control={control}
            name="expertConnection"
            label="Expert Connection"
            mode={mode}
            options={[
              { value: "Oui", label: "Oui" },
              { value: "Non", label: "Non" },
            ]}
            isLoading={localIsLoading}
          />

          <Controller
            control={control}
            name="produitEC1"
            rules={{
              validate: (value, formValues) => {
                if (formValues.expertConnection === "Oui" && !value) {
                  return "Ce champ est obligatoire";
                }
                return true;
              },
            }}
            render={({ field }) => (
              <FormDropdown
                {...field}
                control={control}
                name="produitEC1"
                label="Produit 1"
                mode={mode}
                options={expertConnectionOptions}
                required={isFieldRequired("produitEC1")}
                hidden={mode === "VIEW" && !produitEC1 && !dateProduitEC1}
                isLoading={localIsLoading}
              />
            )}
          />

          <Controller
            control={control}
            name="dateProduitEC1"
            rules={{
              validate: (value, formValues) => {
                if (
                  (formValues.expertConnection === "Oui" ||
                    formValues.produitEC1) &&
                  !value
                ) {
                  return "Ce champ est obligatoire";
                }
                return true;
              },
            }}
            render={({ field }) => (
              <FormDatePicker
                {...field}
                control={control}
                name="dateProduitEC1"
                label="Date Produit 1"
                mode={mode}
                required={isFieldRequired("dateProduitEC1")}
                hidden={mode === "VIEW" && !produitEC1 && !dateProduitEC1}
                isLoading={localIsLoading}
              />
            )}
          />

          <Controller
            control={control}
            name="produitEC2"
            rules={{
              validate: (value, formValues) => {
                if (formValues.dateProduitEC2 && !value) {
                  return "Ce champ est obligatoire";
                }
                return true;
              },
            }}
            render={({ field }) => (
              <FormDropdown
                {...field}
                control={control}
                name="produitEC2"
                label="Produit 2"
                mode={mode}
                options={expertConnectionOptions}
                required={isFieldRequired("produitEC2")}
                hidden={
                  mode === "VIEW"
                    ? !produitEC2 && !dateProduitEC2
                    : !produitEC1 && !dateProduitEC1
                }
                isLoading={localIsLoading}
              />
            )}
          />

          <Controller
            control={control}
            name="dateProduitEC2"
            rules={{
              validate: (value, formValues) => {
                if (formValues.produitEC2 && !value) {
                  return "Ce champ est obligatoire";
                }
                return true;
              },
            }}
            render={({ field }) => (
              <FormDatePicker
                {...field}
                control={control}
                name="dateProduitEC2"
                label="Date Produit 2"
                mode={mode}
                required={isFieldRequired("dateProduitEC2")}
                hidden={
                  mode === "VIEW"
                    ? !produitEC2 && !dateProduitEC2
                    : !produitEC1 && !dateProduitEC1
                }
                isLoading={localIsLoading}
              />
            )}
          />

          <Controller
            control={control}
            name="produitEC3"
            rules={{
              validate: (value, formValues) => {
                if (formValues.dateProduitEC3 && !value) {
                  return "Ce champ est obligatoire";
                }
                return true;
              },
            }}
            render={({ field }) => (
              <FormDropdown
                {...field}
                control={control}
                name="produitEC3"
                label="Produit 3"
                mode={mode}
                options={expertConnectionOptions}
                required={isFieldRequired("produitEC3")}
                hidden={
                  mode === "VIEW"
                    ? !produitEC3 && !dateProduitEC3
                    : !produitEC2 && !dateProduitEC2
                }
                isLoading={localIsLoading}
              />
            )}
          />

          <Controller
            control={control}
            name="dateProduitEC3"
            rules={{
              validate: (value, formValues) => {
                if (formValues.produitEC3 && !value) {
                  return "Ce champ est obligatoire";
                }
                return true;
              },
            }}
            render={({ field }) => (
              <FormDatePicker
                {...field}
                control={control}
                name="dateProduitEC3"
                label="Date Produit 3"
                mode={mode}
                required={isFieldRequired("dateProduitEC3")}
                hidden={
                  mode === "VIEW"
                    ? !produitEC3 && !dateProduitEC3
                    : !produitEC2 && !dateProduitEC2
                }
                isLoading={localIsLoading}
              />
            )}
          />

          <Controller
            control={control}
            name="produitEC4"
            rules={{
              validate: (value, formValues) => {
                if (formValues.dateProduitEC4 && !value) {
                  return "Ce champ est obligatoire";
                }
                return true;
              },
            }}
            render={({ field }) => (
              <FormDropdown
                {...field}
                control={control}
                name="produitEC4"
                label="Produit 4"
                mode={mode}
                options={expertConnectionOptions}
                required={isFieldRequired("produitEC4")}
                hidden={
                  mode === "VIEW"
                    ? !produitEC4 && !dateProduitEC4
                    : !produitEC3 && !dateProduitEC3
                }
                isLoading={localIsLoading}
              />
            )}
          />

          <Controller
            control={control}
            name="dateProduitEC4"
            rules={{
              validate: (value, formValues) => {
                if (formValues.produitEC4 && !value) {
                  return "Ce champ est obligatoire";
                }
                return true;
              },
            }}
            render={({ field }) => (
              <FormDatePicker
                {...field}
                control={control}
                name="dateProduitEC4"
                label="Date Produit 4"
                mode={mode}
                required={isFieldRequired("dateProduitEC4")}
                hidden={
                  mode === "VIEW"
                    ? !produitEC4 && !dateProduitEC4
                    : !produitEC3 && !dateProduitEC3
                }
                isLoading={localIsLoading}
              />
            )}
          />

          <Controller
            control={control}
            name="produitEC5"
            rules={{
              validate: (value, formValues) => {
                if (formValues.dateProduitEC5 && !value) {
                  return "Ce champ est obligatoire";
                }
                return true;
              },
            }}
            render={({ field }) => (
              <FormDropdown
                {...field}
                control={control}
                name="produitEC5"
                label="Produit 5"
                mode={mode}
                options={expertConnectionOptions}
                required={isFieldRequired("produitEC5")}
                hidden={
                  mode === "VIEW"
                    ? !produitEC5 && !dateProduitEC5
                    : !produitEC4 && !dateProduitEC4
                }
                isLoading={localIsLoading}
              />
            )}
          />

          <Controller
            control={control}
            name="dateProduitEC5"
            rules={{
              validate: (value, formValues) => {
                if (formValues.produitEC5 && !value) {
                  return "Ce champ est obligatoire";
                }
                return true;
              },
            }}
            render={({ field }) => (
              <FormDatePicker
                {...field}
                control={control}
                name="dateProduitEC5"
                label="Date Produit 5"
                mode={mode}
                required={isFieldRequired("dateProduitEC5")}
                hidden={
                  mode === "VIEW"
                    ? !produitEC5 && !dateProduitEC5
                    : !produitEC4 && !dateProduitEC4
                }
                isLoading={localIsLoading}
              />
            )}
          />
        </FormSubSection>
      </FormSection>
    </form>
  );
};
