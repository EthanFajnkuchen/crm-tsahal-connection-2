import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ActiviteConf } from "@/store/adapters/activite-conf/activite-conf.adapter";
import {
  getActiviteConfByActivityTypeThunk,
  updateActiviteConfThunk,
} from "@/store/thunks/activite-conf/activite-conf.thunk";

interface ActiviteConfState {
  activiteConfs: ActiviteConf[];
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
}

const initialState: ActiviteConfState = {
  activiteConfs: [],
  isLoading: false,
  isUpdating: false,
  error: null,
};

const activiteConfSlice = createSlice({
  name: "activiteConf",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearActiviteConfs: (state) => {
      state.activiteConfs = [];
    },
  },
  extraReducers: (builder) => {
    // Get activite confs by activity type
    builder
      .addCase(getActiviteConfByActivityTypeThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getActiviteConfByActivityTypeThunk.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.activiteConfs = action.payload;
        }
      )
      .addCase(getActiviteConfByActivityTypeThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch activite confs";
      })
      // Update activite conf
      .addCase(updateActiviteConfThunk.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateActiviteConfThunk.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.activiteConfs.findIndex(
          (conf) => conf.id === action.payload.id
        );
        if (index !== -1) {
          state.activiteConfs[index] = action.payload;
        }
      })
      .addCase(updateActiviteConfThunk.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.error.message || "Failed to update activite conf";
      });
  },
});

export const { clearError, clearActiviteConfs } = activiteConfSlice.actions;
export default activiteConfSlice.reducer;
