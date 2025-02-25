import { createSlice } from "@reduxjs/toolkit";
import { fetchYearlyDataThunk } from "../../thunks/dashboard/yearly-data.thunk";
import { YearlyData } from "../../adapters/dashboard/yearly-data.adapter";

interface YearlyDataState {
  data: YearlyData | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  isLoading: boolean;
  error: string | null;
}

const initialState: YearlyDataState = {
  data: null,
  status: "idle",
  isLoading: false,
  error: null,
};

const yearlyDataSlice = createSlice({
  name: "yearlyData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchYearlyDataThunk.pending, (state) => {
        state.isLoading = true;
        state.status = "loading";
      })
      .addCase(fetchYearlyDataThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchYearlyDataThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch yearly data";
      });
  },
});

export default yearlyDataSlice.reducer;
