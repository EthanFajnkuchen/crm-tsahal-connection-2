import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchExpertCoStatsByYear,
  ExpertCoYearlyStats,
} from "@/store/adapters/expert-connection/stats-by-year.adapter";

export const fetchExpertCoStatsByYearThunk =
  createAsyncThunk<ExpertCoYearlyStats>(
    "expertCoStatsByYear/fetch",
    async () => {
      return await fetchExpertCoStatsByYear();
    }
  );
