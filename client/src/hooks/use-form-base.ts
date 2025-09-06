import { useState } from "react";
import { Lead } from "@/types/lead";

interface UseFormBaseOptions {
  fieldsToCheck: string[];
  dateFields?: string[];
}

interface ChangeDetectionResult {
  fieldChanged: string;
  oldValue: string;
  newValue: string;
}

export const useFormBase = ({
  fieldsToCheck,
  dateFields = [],
}: UseFormBaseOptions) => {
  const [mode, setMode] = useState<"EDIT" | "VIEW">("VIEW");
  const [localIsLoading, setLocalIsLoading] = useState(false);

  // Helper function to safely convert values to strings
  const toString = (value: any): string => {
    if (value === null || value === undefined) return "";
    return String(value);
  };

  // Helper function to format dates for display
  const formatDateForDisplay = (value: string, fieldName: string): string => {
    if (!value) return value;

    if (dateFields.includes(fieldName)) {
      const dateValue = new Date(value);
      if (!isNaN(dateValue.getTime())) {
        return dateValue.toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      }
    }

    return value;
  };

  // Helper function to format values for display in change requests
  const formatValueForDisplay = (value: any, fieldName: string): string => {
    if (value === null || value === undefined) return "";

    if (dateFields.includes(fieldName)) {
      const dateValue = new Date(value);
      if (!isNaN(dateValue.getTime())) {
        return dateValue.toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      }
    }

    return String(value);
  };

  // Helper function to format values for database storage (dates as yyyy-MM-dd)
  const formatValueForStorage = (value: any, fieldName: string): string => {
    if (value === null || value === undefined) return "";

    if (dateFields.includes(fieldName)) {
      const dateValue = new Date(value);
      if (!isNaN(dateValue.getTime())) {
        // Format as yyyy-MM-dd for database storage
        return dateValue.toISOString().split("T")[0];
      }
    }

    return String(value);
  };

  // Function to detect changes between original lead and form data
  const detectChanges = (
    formData: Partial<Lead>,
    originalLead: Partial<Lead>
  ): ChangeDetectionResult[] => {
    const changes: ChangeDetectionResult[] = [];

    fieldsToCheck.forEach((fieldName) => {
      const formValue = toString(formData[fieldName as keyof Lead]);
      const originalValue = toString(originalLead[fieldName as keyof Lead]);

      if (formValue !== originalValue) {
        changes.push({
          fieldChanged: fieldName,
          oldValue: formatValueForStorage(
            originalLead[fieldName as keyof Lead],
            fieldName
          ),
          newValue: formatValueForStorage(
            formData[fieldName as keyof Lead],
            fieldName
          ),
        });
      }
    });

    return changes;
  };

  const handleModeChange = () => {
    setMode((prevMode) => (prevMode === "VIEW" ? "EDIT" : "VIEW"));
  };

  const handleCancel = (reset: () => void) => {
    reset();
    setMode("VIEW");
  };

  return {
    mode,
    setMode,
    localIsLoading,
    setLocalIsLoading,
    toString,
    formatDateForDisplay,
    formatValueForDisplay,
    formatValueForStorage,
    detectChanges,
    handleModeChange,
    handleCancel,
  };
};

export type { ChangeDetectionResult };
