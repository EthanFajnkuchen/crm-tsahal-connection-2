import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  bulkUpdateTsavRishonGrades,
  bulkUpdateTsavRishonDate,
  BulkTsavRishonGradesRequest,
  BulkTsavRishonDateRequest,
  BulkTsavRishonResponse,
} from "../../adapters/bulk-operations/bulk-tsav-rishon.adapter";

export const bulkUpdateTsavRishonGradesThunk = createAsyncThunk<
  BulkTsavRishonResponse,
  BulkTsavRishonGradesRequest
>("bulkOperations/bulkUpdateTsavRishonGrades", async (data) => {
  return await bulkUpdateTsavRishonGrades(data);
});

export const bulkUpdateTsavRishonDateThunk = createAsyncThunk<
  BulkTsavRishonResponse,
  BulkTsavRishonDateRequest
>("bulkOperations/bulkUpdateTsavRishonDate", async (data) => {
  return await bulkUpdateTsavRishonDate(data);
});
