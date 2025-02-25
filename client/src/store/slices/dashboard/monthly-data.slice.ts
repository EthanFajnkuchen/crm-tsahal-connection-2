import { createSlice } from "@reduxjs/toolkit";
import { fetchMonthlyDataThunk } from "../../thunks/dashboard/monthly-data.thunk";
import { MonthlyData } from "../../adapters/dashboard/monthly-data.adapter";

interface MonthlyDataState {
  data: MonthlyData | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  isLoading: boolean;
  error: string | null;
}

const initialState: MonthlyDataState = {
  data: null,
  status: "idle",
  isLoading: false,
  error: null,
};

const monthlyDataSlice = createSlice({
  name: "monthlyData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonthlyDataThunk.pending, (state) => {
        state.isLoading = true;
        state.status = "loading";
      })
      .addCase(fetchMonthlyDataThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchMonthlyDataThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch monthly data";
      });
  },
});

export default monthlyDataSlice.reducer;
