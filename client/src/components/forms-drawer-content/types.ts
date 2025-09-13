// Types partagés pour les formulaires drawer

export type FormValues = {
  leads: string[];
  noteDapar: string;
  simoulIvrit: string;
  profileMedical: string;
};

export type TsavRishonDateFormValues = {
  leads: string[];
  tsavRishonDate: string;
  recruitmentCenter: string;
};

export type GiyusFormValues = {
  leads: string[];
  giyusDate: string;
  michveAlonTraining: string;
};

// Configuration générique pour les formulaires bulk
export interface BulkFormField {
  name: string;
  label: string;
  type: "select" | "date" | "text" | "multiselect";
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
  required?: boolean;
}

export interface BulkFormConfig {
  title: string;
  description: string;
  fields: BulkFormField[];
  submitText: string;
  successMessage: string;
  bulkUpdateType: "tsav-rishon-grades" | "tsav-rishon-date";
}
