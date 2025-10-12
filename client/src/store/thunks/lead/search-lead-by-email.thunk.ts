import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  searchLeadByEmailAdapter,
  ApiLead,
} from "@/store/adapters/lead/search-lead-by-email.adapter";

export const searchLeadByEmailThunk = createAsyncThunk<ApiLead[], string>(
  "lead/searchByEmail",
  async (email: string) => {
    return await searchLeadByEmailAdapter(email);
  }
);
