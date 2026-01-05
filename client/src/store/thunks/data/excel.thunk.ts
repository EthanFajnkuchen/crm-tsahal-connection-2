import { createAsyncThunk } from "@reduxjs/toolkit";
import { downloadLeads } from "@/store/adapters/data/excel.adapter";

interface LeadFilters {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  statutCandidat?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  passportNumber1?: string;
  expertConnection?: string;
  statutLoiRetour?: string;
  currentStatus?: string;
  [key: string]: string | undefined;
}

export const downloadLeadsThunk = createAsyncThunk(
  "leads/downloadLeads",
  async (filters?: LeadFilters, { rejectWithValue }) => {
    try {
      const fileBlob = await downloadLeads(filters);
      return fileBlob;
    } catch (error: any) {
      return rejectWithValue(error.message || "Download failed");
    }
  }
);
