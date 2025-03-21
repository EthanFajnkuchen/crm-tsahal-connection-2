import { createSlice } from "@reduxjs/toolkit";
import { fetchExpertCoStatsByYearThunk } from "@/store/thunks/expert-connection/stats-by-year.thunk";
import { ExpertCoYearlyStats } from "@/store/adapters/expert-connection/stats-by-year.adapter";

interface ExpertCoStatsByYearState {
  data: ExpertCoYearlyStats | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  isLoading: boolean;
  error: string | null;
}

const initialState: ExpertCoStatsByYearState = {
  data: null,
  status: "idle",
  isLoading: false,
  error: null,
};

const expertCoStatsByYearSlice = createSlice({
  name: "expertCoStatsByYear",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpertCoStatsByYearThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExpertCoStatsByYearThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchExpertCoStatsByYearThunk.rejected, (state, action) => {
        state.status = "failed";
        state.isLoading = false;
        state.error =
          action.error.message ?? "Failed to fetch expert co stats by year";
      });
  },
});

export default expertCoStatsByYearSlice.reducer;
