import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchLastTenLeads } from "../../adapters/dashboard/last-ten-leads.adapter";
import { Lead } from "@/types/lead";

export const fetchLastTenLeadsThunk = createAsyncThunk<Lead[]>(
  "dashboard/fetchLastTenLeads",
  async () => {
    return await fetchLastTenLeads();
  }
);
