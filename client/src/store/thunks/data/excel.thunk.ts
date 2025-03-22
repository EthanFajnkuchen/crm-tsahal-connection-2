import { createAsyncThunk } from "@reduxjs/toolkit";
import { downloadLeads } from "@/store/adapters/data/excel.adapter";

export const downloadLeadsThunk = createAsyncThunk(
  "leads/downloadLeads",
  async (_, { rejectWithValue }) => {
    try {
      const fileBlob = await downloadLeads();
      return fileBlob;
    } catch (error: any) {
      return rejectWithValue(error.message || "Download failed");
    }
  }
);
