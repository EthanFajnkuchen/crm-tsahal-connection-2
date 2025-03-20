import { createSlice } from "@reduxjs/toolkit";
import { fetchProductStatsThunk } from "../../thunks/expert-connection/charts.thunk";
import { ProductStats } from "../../adapters/expert-connection/charts.adapter";

interface ProductStatsState {
  data: ProductStats | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductStatsState = {
  data: null,
  status: "idle",
  isLoading: false,
  error: null,
};

const expertCoChartsTotalSlice = createSlice({
  name: "expertCoChartsTotal",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductStatsThunk.fulfilled, (state, action) => {
        if (!action.meta.arg) {
          // current = false
          state.isLoading = false;
          state.status = "succeeded";
          state.data = action.payload;
        }
      })
      .addCase(fetchProductStatsThunk.pending, (state, action) => {
        if (!action.meta.arg) {
          state.isLoading = true;
          state.status = "loading";
        }
      })
      .addCase(fetchProductStatsThunk.rejected, (state, action) => {
        if (!action.meta.arg) {
          state.isLoading = false;
          state.status = "failed";
          state.error =
            action.error.message ?? "Failed to fetch total product statistics";
        }
      });
  },
});

export default expertCoChartsTotalSlice.reducer;
