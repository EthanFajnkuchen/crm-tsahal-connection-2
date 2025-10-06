import { createSlice } from "@reduxjs/toolkit";
import { ActiviteMassa } from "@/store/adapters/activite-massa/activite-massa.adapter";
import {
  createActiviteMassaThunk,
  getActiviteMassaThunk,
  updateActiviteMassaThunk,
  deleteActiviteMassaThunk,
} from "@/store/thunks/activite-massa/activite-massa.thunk";

interface ActiviteMassaState {
  activiteMassa: ActiviteMassa[];
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
}

const initialState: ActiviteMassaState = {
  activiteMassa: [],
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
};

const activiteMassaSlice = createSlice({
  name: "activiteMassa",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearActiviteMassa: (state) => {
      state.activiteMassa = [];
    },
  },
  extraReducers: (builder) => {
    // Create activite massa
    builder
      .addCase(createActiviteMassaThunk.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createActiviteMassaThunk.fulfilled, (state, action) => {
        state.isCreating = false;
        state.activiteMassa.unshift(action.payload); // Add new activite massa at the beginning
      })
      .addCase(createActiviteMassaThunk.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.error.message || "Failed to create activite massa";
      })
      // Get activite massa
      .addCase(getActiviteMassaThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getActiviteMassaThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activiteMassa = action.payload;
      })
      .addCase(getActiviteMassaThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch activite massa";
      })
      // Update activite massa
      .addCase(updateActiviteMassaThunk.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateActiviteMassaThunk.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.activiteMassa.findIndex(
          (activiteMassa) => activiteMassa.id === action.payload.id
        );
        if (index !== -1) {
          state.activiteMassa[index] = action.payload;
        }
      })
      .addCase(updateActiviteMassaThunk.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.error.message || "Failed to update activite massa";
      })
      // Delete activite massa
      .addCase(deleteActiviteMassaThunk.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteActiviteMassaThunk.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.activiteMassa = state.activiteMassa.filter(
          (activiteMassa) => activiteMassa.id !== action.payload
        );
      })
      .addCase(deleteActiviteMassaThunk.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.error.message || "Failed to delete activite massa";
      });
  },
});

export const { clearError, clearActiviteMassa } = activiteMassaSlice.actions;
export default activiteMassaSlice.reducer;
