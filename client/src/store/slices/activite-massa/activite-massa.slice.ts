import { createSlice } from "@reduxjs/toolkit";
import { ActiviteMassa } from "@/store/adapters/activite-massa/activite-massa.adapter";
import {
  createActiviteMassaThunk,
  getActiviteMassaThunk,
} from "@/store/thunks/activite-massa/activite-massa.thunk";

interface ActiviteMassaState {
  activiteMassa: ActiviteMassa[];
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
}

const initialState: ActiviteMassaState = {
  activiteMassa: [],
  isLoading: false,
  isCreating: false,
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
      });
  },
});

export const { clearError, clearActiviteMassa } = activiteMassaSlice.actions;
export default activiteMassaSlice.reducer;
