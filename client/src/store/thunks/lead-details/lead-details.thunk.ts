import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchLeadDetails,
  updateLead,
  LeadDetails,
} from "../../adapters/lead-details/lead-details.adapter";

export const fetchLeadDetailsThunk = createAsyncThunk<LeadDetails, string>(
  "leadDetails/fetchLeadDetails",
  async (id) => {
    return await fetchLeadDetails(id);
  }
);

export const updateLeadThunk = createAsyncThunk<
  LeadDetails,
  { id: string; updateData: Partial<LeadDetails> }
>("leadDetails/updateLead", async ({ id, updateData }) => {
  return await updateLead(id, updateData);
});
