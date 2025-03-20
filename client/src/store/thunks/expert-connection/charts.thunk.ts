import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchProductStats,
  ProductStats,
} from "../../adapters/expert-connection/charts.adapter";

export const fetchProductStatsThunk = createAsyncThunk<ProductStats, boolean>(
  "expertCoCharts/fetch",
  async (current) => {
    return await fetchProductStats(current);
  }
);
