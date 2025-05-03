import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchLeadDetails,
  LeadDetails,
} from "../../adapters/lead-details/lead-details.adapter";

export const fetchLeadDetailsThunk = createAsyncThunk<LeadDetails, string>(
  "leadDetails/fetchLeadDetails",
  async (id) => {
    return await fetchLeadDetails(id);
  }
);
