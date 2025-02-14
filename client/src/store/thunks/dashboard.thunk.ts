import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchDashboardDataFromApi,
  MonthlyData,
  YearlyData,
  Lead,
} from "../adapters/dashboard.adapter";

export interface DashboardData {
  monthlyData: MonthlyData;
  yearlyData: YearlyData;
  lastTenLeads: Lead[];
}

export const fetchDashboardData = createAsyncThunk<DashboardData>(
  "dashboard/fetchDashboardData",
  async () => {
    const data = await fetchDashboardDataFromApi();
    return data;
  }
);
