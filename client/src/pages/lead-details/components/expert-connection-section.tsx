import { useForm } from "react-hook-form";
import { Lead } from "@/types/lead";
import {
  FormSection,
  FormSubSection,
} from "@/components/form-components/form-section";
import { FormDropdown } from "@/components/form-components/form-dropdown";
import { FormDatePicker } from "@/components/form-components/form-date-picker";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { updateLeadThunk } from "@/store/thunks/lead-details/lead-details.thunk";
import { toast } from "sonner";

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
{ value: "null", label: "Vide" },
];

export const ExpertConnectionSection = ({
  lead,
}: ExpertConnectionSectionProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isUpdating, updateStatus, updateError } = useSelector(
    (state: RootState) => state.leadDetails
  );

  const [mode, setMode] = useState<"EDIT" | "VIEW">("VIEW");

  const { control, handleSubmit, reset, watch } = useForm<Partial<Lead>>({
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

  const handleModeChange = () => {
    setMode("EDIT");
  };

  const handleSave = async (data: Partial<Lead>) => {
    try {
      await dispatch(
        updateLeadThunk({
          id: lead.ID.toString(),
          updateData: data,
        })
      ).unwrap();

      toast.success("Le lead a été modifié avec succès");
      setMode("VIEW");
    } catch (error) {
      console.error("Failed to update lead:", error);
      toast.error("Erreur lors de la modification du lead");
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
        isLoading={isUpdating}
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
          />

          <FormDropdown
            control={control}
            name="produitEC1"
            label="Produit 1"
            mode={mode}
            options={expertConnectionOptions}
            hidden={mode === "VIEW" && !produitEC1 && !dateProduitEC1}
          />
          <FormDatePicker
            control={control}
            name="dateProduitEC1"
            label="Date Produit 1"
            mode={mode}
            hidden={mode === "VIEW" && !produitEC1 && !dateProduitEC1}
          />

          <FormDropdown
            control={control}
            name="produitEC2"
            label="Produit 2"
            mode={mode}
            options={expertConnectionOptions}
            hidden={
              mode === "VIEW"
                ? !produitEC2 && !dateProduitEC2
                : !produitEC1 && !dateProduitEC1
            }
          />
          <FormDatePicker
            control={control}
            name="dateProduitEC2"
            label="Date Produit 2"
            mode={mode}
            hidden={
              mode === "VIEW"
                ? !produitEC2 && !dateProduitEC2
                : !produitEC1 && !dateProduitEC1
            }
          />

          <FormDropdown
            control={control}
            name="produitEC3"
            label="Produit 3"
            mode={mode}
            options={expertConnectionOptions}
            hidden={
              mode === "VIEW"
                ? !produitEC3 && !dateProduitEC3
                : !produitEC2 && !dateProduitEC2
            }
          />
          <FormDatePicker
            control={control}
            name="dateProduitEC3"
            label="Date Produit 3"
            mode={mode}
            hidden={
              mode === "VIEW"
                ? !produitEC3 && !dateProduitEC3
                : !produitEC2 && !dateProduitEC2
            }
          />

          <FormDropdown
            control={control}
            name="produitEC4"
            label="Produit 4"
            mode={mode}
            options={expertConnectionOptions}
            hidden={
              mode === "VIEW"
                ? !produitEC4 && !dateProduitEC4
                : !produitEC3 && !dateProduitEC3
            }
          />
          <FormDatePicker
            control={control}
            name="dateProduitEC4"
            label="Date Produit 4"
            mode={mode}
            hidden={
              mode === "VIEW"
                ? !produitEC4 && !dateProduitEC4
                : !produitEC3 && !dateProduitEC3
            }
          />

          <FormDropdown
            control={control}
            name="produitEC5"
            label="Produit 5"
            mode={mode}
            options={expertConnectionOptions}
            hidden={
              mode === "VIEW"
                ? !produitEC5 && !dateProduitEC5
                : !produitEC4 && !dateProduitEC4
            }
          />
          <FormDatePicker
            control={control}
            name="dateProduitEC5"
            label="Date Produit 5"
            mode={mode}
            hidden={
              mode === "VIEW"
                ? !produitEC5 && !dateProduitEC5
                : !produitEC4 && !dateProduitEC4
            }
          />
        </FormSubSection>
      </FormSection>
    </form>
  );
};
