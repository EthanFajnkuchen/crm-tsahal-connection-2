import { createSlice } from "@reduxjs/toolkit";
import { fetchLastTenLeadsThunk } from "../../thunks/dashboard/last-ten-leads.thunk";
import { Lead } from "@/types/lead";

interface LastTenLeadsState {
  data: Lead[] | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  isLoading: boolean;
  error: string | null;
}

const initialState: LastTenLeadsState = {
  data: null,
  status: "idle",
  isLoading: false,
  error: null,
};

const lastTenLeadsSlice = createSlice({
  name: "lastTenLeads",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLastTenLeadsThunk.pending, (state) => {
        state.isLoading = true;
        state.status = "loading";
      })
      .addCase(fetchLastTenLeadsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchLastTenLeadsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch last ten leads";
      });
  },
});

export default lastTenLeadsSlice.reducer;
