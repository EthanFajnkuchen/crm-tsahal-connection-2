import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchMonthlyData,
  MonthlyData,
} from "../../adapters/dashboard/monthly-data.adapter";

export const fetchMonthlyDataThunk = createAsyncThunk<MonthlyData>(
  "dashboard/fetchMonthlyData",
  async () => {
    return await fetchMonthlyData();
  }
);
