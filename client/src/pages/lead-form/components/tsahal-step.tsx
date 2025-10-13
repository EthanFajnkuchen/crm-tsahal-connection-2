import React from "react";
import { UseFormReturn } from "react-hook-form";
import { LeadFormData } from "../LeadForm";

interface TsahalStepProps {
  form: UseFormReturn<LeadFormData>;
}

export const TsahalStep: React.FC<TsahalStepProps> = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
        Tsahal
      </h3>
      <p className="text-gray-600">
        Cette section sera implémentée prochainement.
      </p>
    </div>
  );
};
