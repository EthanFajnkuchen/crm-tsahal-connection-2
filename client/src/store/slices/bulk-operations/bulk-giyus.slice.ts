import { createSlice } from "@reduxjs/toolkit";
import { bulkUpdateGiyusThunk } from "@/store/thunks/bulk-operations/bulk-giyus.thunk";

interface BulkGiyusState {
  isLoading: boolean;
  data: {
    updated: number;
    failed: number;
    errors: string[];
  } | null;
  error: string | null;
}

const initialState: BulkGiyusState = {
  isLoading: false,
  data: null,
  error: null,
};

const bulkGiyusSlice = createSlice({
  name: "bulkGiyus",
  initialState,
  reducers: {
    clearBulkGiyusState: (state) => {
      state.data = null;
      state.error = null;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bulkUpdateGiyusThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(bulkUpdateGiyusThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(bulkUpdateGiyusThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to update Giyus data";
        state.data = null;
      });
  },
});

export const { clearBulkGiyusState } = bulkGiyusSlice.actions;
export default bulkGiyusSlice.reducer;
