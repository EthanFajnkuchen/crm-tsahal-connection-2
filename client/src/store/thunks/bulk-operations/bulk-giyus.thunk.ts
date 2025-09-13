import { createAsyncThunk } from "@reduxjs/toolkit";
import { bulkGiyusAdapter } from "@/store/adapters/bulk-operations/bulk-giyus.adapter";

export const bulkUpdateGiyusThunk = createAsyncThunk(
  "bulk-giyus/update",
  async (data: {
    leadIds: number[];
    giyusDate: string;
    michveAlonTraining?: string;
  }) => {
    return await bulkGiyusAdapter(data);
  }
);
