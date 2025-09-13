import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  bulkUpdateTsavRishonGradesThunk,
  bulkUpdateTsavRishonDateThunk,
} from "../../thunks/bulk-operations/bulk-tsav-rishon.thunk";
import { BulkTsavRishonResponse } from "../../adapters/bulk-operations/bulk-tsav-rishon.adapter";

interface BulkTsavRishonState {
  gradesData: BulkTsavRishonResponse | null;
  dateData: BulkTsavRishonResponse | null;
  isGradesLoading: boolean;
  isDateLoading: boolean;
  gradesError: string | null;
  dateError: string | null;
}

const initialState: BulkTsavRishonState = {
  gradesData: null,
  dateData: null,
  isGradesLoading: false,
  isDateLoading: false,
  gradesError: null,
  dateError: null,
};

const bulkTsavRishonSlice = createSlice({
  name: "bulkTsavRishon",
  initialState,
  reducers: {
    clearBulkTsavRishonState: (state) => {
      state.gradesData = null;
      state.dateData = null;
      state.gradesError = null;
      state.dateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Grades operations
      .addCase(bulkUpdateTsavRishonGradesThunk.pending, (state) => {
        state.isGradesLoading = true;
        state.gradesError = null;
      })
      .addCase(
        bulkUpdateTsavRishonGradesThunk.fulfilled,
        (state, action: PayloadAction<BulkTsavRishonResponse>) => {
          state.isGradesLoading = false;
          state.gradesData = action.payload;
          state.gradesError = null;
        }
      )
      .addCase(bulkUpdateTsavRishonGradesThunk.rejected, (state, action) => {
        state.isGradesLoading = false;
        state.gradesError =
          action.error.message || "Failed to update Tsav Rishon grades";
      })
      // Date operations
      .addCase(bulkUpdateTsavRishonDateThunk.pending, (state) => {
        state.isDateLoading = true;
        state.dateError = null;
      })
      .addCase(
        bulkUpdateTsavRishonDateThunk.fulfilled,
        (state, action: PayloadAction<BulkTsavRishonResponse>) => {
          state.isDateLoading = false;
          state.dateData = action.payload;
          state.dateError = null;
        }
      )
      .addCase(bulkUpdateTsavRishonDateThunk.rejected, (state, action) => {
        state.isDateLoading = false;
        state.dateError =
          action.error.message || "Failed to update Tsav Rishon date";
      });
  },
});

export const { clearBulkTsavRishonState } = bulkTsavRishonSlice.actions;
export default bulkTsavRishonSlice.reducer;
