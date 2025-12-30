import { createSlice } from "@reduxjs/toolkit";
import { fetchAllLeadsThunk } from "../../thunks/data/all-leads.thunk";
import { Lead } from "@/types/lead";

interface LeadsState {
  data: Lead[] | null;
  total: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  isLoading: boolean;
  error: string | null;
}

const initialState: LeadsState = {
  data: null,
  total: 0,
  status: "idle",
  isLoading: false,
  error: null,
};

const leadsSlice = createSlice({
  name: "leads",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllLeadsThunk.pending, (state) => {
        state.isLoading = true;
        state.status = "loading";
      })
      .addCase(fetchAllLeadsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = "succeeded";
        state.data = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchAllLeadsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch all leads";
      });
  },
});

export default leadsSlice.reducer;
