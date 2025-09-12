import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { bulkUpdateTsavRishonThunk } from "../../thunks/bulk-operations/bulk-tsav-rishon.thunk";
import { BulkTsavRishonResponse } from "../../adapters/bulk-operations/bulk-tsav-rishon.adapter";

interface BulkTsavRishonState {
  data: BulkTsavRishonResponse | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: BulkTsavRishonState = {
  data: null,
  isLoading: false,
  error: null,
};

const bulkTsavRishonSlice = createSlice({
  name: "bulkTsavRishon",
  initialState,
  reducers: {
    clearBulkTsavRishonState: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bulkUpdateTsavRishonThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        bulkUpdateTsavRishonThunk.fulfilled,
        (state, action: PayloadAction<BulkTsavRishonResponse>) => {
          state.isLoading = false;
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(bulkUpdateTsavRishonThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || "Failed to update Tsav Rishon data";
      });
  },
});

export const { clearBulkTsavRishonState } = bulkTsavRishonSlice.actions;
export default bulkTsavRishonSlice.reducer;
