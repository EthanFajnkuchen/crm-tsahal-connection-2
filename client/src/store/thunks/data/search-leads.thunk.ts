import { createAsyncThunk } from "@reduxjs/toolkit";
import { searchLeads, Lead } from "../../adapters/data/search-leads.adapter";

export const searchLeadsThunk = createAsyncThunk<Lead[], string>(
  "leads/searchLeads",
  async (searchInput) => {
    return await searchLeads(searchInput);
  }
);
