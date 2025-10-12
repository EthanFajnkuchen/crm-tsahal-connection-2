import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAllLeads } from "../../adapters/data/all-leads.adapter";
import { Lead } from "@/types/lead";

export const fetchAllLeadsThunk = createAsyncThunk<Lead[]>(
  "leads/fetchAllLeads",
  async () => {
    return await fetchAllLeads();
  }
);
