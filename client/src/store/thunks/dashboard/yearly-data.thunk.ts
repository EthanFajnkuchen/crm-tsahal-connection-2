import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchYearlyData,
  YearlyData,
} from "../../adapters/dashboard/yearly-data.adapter";

export const fetchYearlyDataThunk = createAsyncThunk<YearlyData>(
  "dashboard/fetchYearlyData",
  async () => {
    return await fetchYearlyData();
  }
);
