import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchExpertCoStats,
  ExpertCoStats,
} from "../../adapters/expert-connection/expert-co-stats.adapter";

export const fetchExpertCoStatsThunk = createAsyncThunk<ExpertCoStats>(
  "expertCoStats/fetch",
  async () => {
    return await fetchExpertCoStats();
  }
);
