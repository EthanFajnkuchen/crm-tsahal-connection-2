import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAllLeads } from "../../adapters/data/all-leads.adapter";
import { Lead } from "@/types/lead";

interface FetchLeadsParams {
  page: number;
  limit?: number;
}

interface FetchLeadsResponse {
  data: Lead[];
  total: number;
}

export const fetchAllLeadsThunk = createAsyncThunk<
  FetchLeadsResponse,
  FetchLeadsParams
>("leads/fetchAllLeads", async ({ page, limit = 15 }) => {
  return await fetchAllLeads(page, limit);
});
