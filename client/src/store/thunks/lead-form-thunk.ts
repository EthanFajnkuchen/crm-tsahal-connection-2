import { createAsyncThunk } from "@reduxjs/toolkit";
import { LeadFormData } from "@/pages/lead-form/LeadForm";
import { LeadFormAdapter } from "../adapters/lead-form-adapter";

export const submitLeadForm = createAsyncThunk(
  "leadForm/submitLeadForm",
  async (formData: LeadFormData, { rejectWithValue }) => {
    try {
      // Validation côté client
      const isValid = await LeadFormAdapter.validateFormData(formData);
      if (!isValid) {
        return rejectWithValue("Les données du formulaire ne sont pas valides");
      }

      // Soumission au serveur
      const response = await LeadFormAdapter.submitLeadForm(formData);

      if (!response.success) {
        return rejectWithValue(response.message);
      }

      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Une erreur inattendue s'est produite";
      return rejectWithValue(errorMessage);
    }
  }
);
