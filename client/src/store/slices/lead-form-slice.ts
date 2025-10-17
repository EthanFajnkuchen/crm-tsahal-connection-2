import { createSlice } from "@reduxjs/toolkit";
import { submitLeadForm } from "../thunks/lead-form-thunk";

interface LeadFormState {
  isSubmitting: boolean;
  submitError: string | null;
  submitSuccess: boolean;
  leadId: string | null;
}

const initialState: LeadFormState = {
  isSubmitting: false,
  submitError: null,
  submitSuccess: false,
  leadId: null,
};

const leadFormSlice = createSlice({
  name: "leadForm",
  initialState,
  reducers: {
    resetFormState: (state) => {
      state.isSubmitting = false;
      state.submitError = null;
      state.submitSuccess = false;
      state.leadId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitLeadForm.pending, (state) => {
        state.isSubmitting = true;
        state.submitError = null;
        state.submitSuccess = false;
      })
      .addCase(submitLeadForm.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.submitSuccess = true;
        state.submitError = null;
        state.leadId = action.payload.leadId || null;
      })
      .addCase(submitLeadForm.rejected, (state, action) => {
        state.isSubmitting = false;
        state.submitError = action.payload as string;
        state.submitSuccess = false;
        state.leadId = null;
      });
  },
});

export const { resetFormState } = leadFormSlice.actions;
export default leadFormSlice.reducer;
