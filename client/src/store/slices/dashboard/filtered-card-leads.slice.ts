import { createSlice } from "@reduxjs/toolkit";
import { fetchFilteredLeadsThunk } from "../../thunks/dashboard/filtered-card-leads.thunk";
import { FilteredLead } from "../../adapters/dashboard/filtered-card-leads.adapter";

interface FilteredLeadsState {
  data: FilteredLead[] | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  isLoading: boolean;
  error: string | null;
}

const initialState: FilteredLeadsState = {
  data: null,
  status: "idle",
  isLoading: false,
  error: null,
};

const filteredLeadsSlice = createSlice({
  name: "filteredLeads",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilteredLeadsThunk.pending, (state) => {
        state.isLoading = true;
        state.status = "loading";
      })
      .addCase(fetchFilteredLeadsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchFilteredLeadsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch filtered leads";
      });
  },
});

export default filteredLeadsSlice.reducer;
