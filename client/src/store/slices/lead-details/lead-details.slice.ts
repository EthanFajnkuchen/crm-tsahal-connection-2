import { createSlice } from "@reduxjs/toolkit";
import {
  fetchLeadDetailsThunk,
  updateLeadThunk,
} from "../../thunks/lead-details/lead-details.thunk";
import { LeadDetails } from "../../adapters/lead-details/lead-details.adapter";

interface LeadDetailsState {
  data: LeadDetails | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  isLoading: boolean;
  error: string | null;
  updateStatus: "idle" | "loading" | "succeeded" | "failed";
  isUpdating: boolean;
  updateError: string | null;
}

const initialState: LeadDetailsState = {
  data: null,
  status: "idle",
  isLoading: false,
  error: null,
  updateStatus: "idle",
  isUpdating: false,
  updateError: null,
};

const leadDetailsSlice = createSlice({
  name: "leadDetails",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeadDetailsThunk.pending, (state) => {
        state.isLoading = true;
        state.status = "loading";
      })
      .addCase(fetchLeadDetailsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchLeadDetailsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch lead details";
      })
      .addCase(updateLeadThunk.pending, (state) => {
        state.isUpdating = true;
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateLeadThunk.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.updateStatus = "succeeded";
        state.data = action.payload;
      })
      .addCase(updateLeadThunk.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateStatus = "failed";
        state.updateError = action.error.message ?? "Failed to update lead";
      });
  },
});

export default leadDetailsSlice.reducer;
