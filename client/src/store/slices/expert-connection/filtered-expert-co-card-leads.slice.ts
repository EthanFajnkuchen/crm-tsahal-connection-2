import { createSlice } from "@reduxjs/toolkit";
import { fetchExpertCoFilteredLeadsThunk } from "../../thunks/expert-connection/filtered-expert-co-card-leads.thunk";
import { ExpertCoFilteredLead } from "../../adapters/expert-connection/filtered-expert-co-card-leads.adapter";

interface ExpertCoFilteredLeadsState {
  data: ExpertCoFilteredLead[] | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  isLoading: boolean;
  error: string | null;
}

const initialState: ExpertCoFilteredLeadsState = {
  data: null,
  status: "idle",
  isLoading: false,
  error: null,
};

const expertCoFilteredLeadsSlice = createSlice({
  name: "expertCoFilteredLeads",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpertCoFilteredLeadsThunk.pending, (state) => {
        state.isLoading = true;
        state.status = "loading";
      })
      .addCase(fetchExpertCoFilteredLeadsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchExpertCoFilteredLeadsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.status = "failed";
        state.error =
          action.error.message ?? "Failed to fetch expert co filtered leads";
      });
  },
});

export default expertCoFilteredLeadsSlice.reducer;
