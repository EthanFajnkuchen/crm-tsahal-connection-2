import { createAsyncThunk } from "@reduxjs/toolkit";
import { searchLeads } from "../../adapters/data/search-leads.adapter";
import { Lead } from "@/types/lead";

export const searchLeadsThunk = createAsyncThunk<Lead[], string>(
  "leads/searchLeads",
  async (searchInput) => {
    return await searchLeads(searchInput);
  }
);
