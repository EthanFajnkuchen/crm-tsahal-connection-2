import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAllLeads, Lead } from "../../adapters/data/all-leads.adapter";

export const fetchAllLeadsThunk = createAsyncThunk<Lead[]>(
  "leads/fetchAllLeads",
  async () => {
    return await fetchAllLeads();
  }
);
