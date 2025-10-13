import React from "react";
import { UseFormReturn } from "react-hook-form";
import { LeadFormData } from "../LeadForm";

interface EducationStepProps {
  form: UseFormReturn<LeadFormData>;
}

export const EducationStep: React.FC<EducationStepProps> = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
        Éducation
      </h3>
      <p className="text-gray-600">
        Cette section sera implémentée prochainement.
      </p>
    </div>
  );
};
