import { createAsyncThunk } from "@reduxjs/toolkit";
import { deleteLead } from "../../adapters/data/delete-lead.adapter";

export const deleteLeadThunk = createAsyncThunk<
  { success: boolean; message: string },
  number
>("leads/deleteLead", async (leadId: number) => {
  return await deleteLead(leadId);
});
