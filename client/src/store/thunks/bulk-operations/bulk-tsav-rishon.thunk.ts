import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  bulkUpdateTsavRishon,
  BulkTsavRishonRequest,
  BulkTsavRishonResponse,
} from "../../adapters/bulk-operations/bulk-tsav-rishon.adapter";

export const bulkUpdateTsavRishonThunk = createAsyncThunk<
  BulkTsavRishonResponse,
  BulkTsavRishonRequest
>("bulkOperations/bulkUpdateTsavRishon", async (data) => {
  return await bulkUpdateTsavRishon(data);
});
