import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchLastTenLeads,
  Lead,
} from "../../adapters/dashboard/last-ten-leads.adapter";

export const fetchLastTenLeadsThunk = createAsyncThunk<Lead[]>(
  "dashboard/fetchLastTenLeads",
  async () => {
    return await fetchLastTenLeads();
  }
);
