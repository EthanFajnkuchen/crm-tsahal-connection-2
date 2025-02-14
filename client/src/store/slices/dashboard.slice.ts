import { createSlice } from "@reduxjs/toolkit";
import { fetchDashboardData, DashboardData } from "../thunks/dashboard.thunk";

interface DashboardState {
  monthlyData: DashboardData["monthlyData"] | null;
  yearlyData: DashboardData["yearlyData"] | null;
  lastTenLeads: DashboardData["lastTenLeads"] | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  isLoading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  monthlyData: null,
  yearlyData: null,
  lastTenLeads: null,
  status: "idle",
  isLoading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.isLoading = true;
        state.status = "loading";
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = "succeeded";
        state.monthlyData = action.payload.monthlyData;
        state.yearlyData = action.payload.yearlyData;
        state.lastTenLeads = action.payload.lastTenLeads;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch dashboard data";
      });
  },
});

export default dashboardSlice.reducer;
