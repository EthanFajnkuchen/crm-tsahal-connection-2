import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCardLeads } from "../../adapters/dashboard/card-leads.adapter";

export const fetchCardLeadsThunk = createAsyncThunk<Record<string, number>>(
  "dashboard/fetchCardLeads",
  async () => {
    return await fetchCardLeads();
  }
);
