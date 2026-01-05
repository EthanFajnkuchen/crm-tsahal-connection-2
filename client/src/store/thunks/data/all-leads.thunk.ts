import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAllLeads } from "../../adapters/data/all-leads.adapter";
import { Lead } from "@/types/lead";

interface FetchLeadsParams {
  page: number;
  limit?: number;
  filters?: {
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
    situationActuelle?: string;
    [key: string]: string | undefined;
  };
}

interface FetchLeadsResponse {
  data: Lead[];
  total: number;
}

export const fetchAllLeadsThunk = createAsyncThunk<
  FetchLeadsResponse,
  FetchLeadsParams
>("leads/fetchAllLeads", async ({ page, limit = 15, filters }) => {
  return await fetchAllLeads(page, limit, filters);
});
