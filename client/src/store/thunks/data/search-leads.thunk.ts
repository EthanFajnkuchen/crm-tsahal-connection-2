import { createAsyncThunk } from "@reduxjs/toolkit";
import { searchLeads } from "../../adapters/data/search-leads.adapter";
import { Lead } from "@/types/lead";

interface SearchFilters {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  statutCandidat?: string;
}

export const searchLeadsThunk = createAsyncThunk<Lead[], SearchFilters>(
  "leads/searchLeads",
  async (filters) => {
    return await searchLeads(filters);
  }
);
