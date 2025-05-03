import { createSlice } from "@reduxjs/toolkit";
import { fetchLeadDetailsThunk } from "../../thunks/lead-details/lead-details.thunk";
import { LeadDetails } from "../../adapters/lead-details/lead-details.adapter";

interface LeadDetailsState {
  data: LeadDetails | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  isLoading: boolean;
  error: string | null;
}

const initialState: LeadDetailsState = {
  data: null,
  status: "idle",
  isLoading: false,
  error: null,
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
      });
  },
});

export default leadDetailsSlice.reducer;
