import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChangeRequest } from "@/types/change-request";
import {
  createChangeRequestThunk,
  getChangeRequestsThunk,
  getChangeRequestsByLeadIdThunk,
  deleteChangeRequestThunk,
  acceptChangeRequestThunk,
  rejectChangeRequestThunk,
} from "@/store/thunks/change-request/change-request.thunk";

interface ChangeRequestState {
  changeRequests: ChangeRequest[];
  changeRequestsByLead: ChangeRequest[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ChangeRequestState = {
  changeRequests: [],
  changeRequestsByLead: [],
  isLoading: false,
  error: null,
};

const changeRequestSlice = createSlice({
  name: "changeRequest",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create change request
      .addCase(createChangeRequestThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        createChangeRequestThunk.fulfilled,
        (state, action: PayloadAction<ChangeRequest>) => {
          state.isLoading = false;
          state.changeRequests.push(action.payload);
        }
      )
      .addCase(createChangeRequestThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to create change request";
      })
      // Get change requests
      .addCase(getChangeRequestsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getChangeRequestsThunk.fulfilled,
        (state, action: PayloadAction<ChangeRequest[]>) => {
          state.isLoading = false;
          state.changeRequests = action.payload;
        }
      )
      .addCase(getChangeRequestsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to get change requests";
      })
      // Get change requests by leadId
      .addCase(getChangeRequestsByLeadIdThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getChangeRequestsByLeadIdThunk.fulfilled,
        (state, action: PayloadAction<ChangeRequest[]>) => {
          state.isLoading = false;
          state.changeRequestsByLead = action.payload;
        }
      )
      .addCase(getChangeRequestsByLeadIdThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || "Failed to get change requests by lead";
      })
      // Delete change request
      .addCase(deleteChangeRequestThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        deleteChangeRequestThunk.fulfilled,
        (state, action: PayloadAction<{ id: number }>) => {
          state.isLoading = false;
          state.changeRequests = state.changeRequests.filter(
            (request) => request.id !== action.payload.id
          );
          state.changeRequestsByLead = state.changeRequestsByLead.filter(
            (request) => request.id !== action.payload.id
          );
        }
      )
      .addCase(deleteChangeRequestThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to delete change request";
      })
      // Accept change request
      .addCase(acceptChangeRequestThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        acceptChangeRequestThunk.fulfilled,
        (state, action: PayloadAction<{ id: number; updatedLead: any }>) => {
          state.isLoading = false;
          state.changeRequests = state.changeRequests.filter(
            (request) => request.id !== action.payload.id
          );
          state.changeRequestsByLead = state.changeRequestsByLead.filter(
            (request) => request.id !== action.payload.id
          );
        }
      )
      .addCase(acceptChangeRequestThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to accept change request";
      })
      // Reject change request
      .addCase(rejectChangeRequestThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        rejectChangeRequestThunk.fulfilled,
        (state, action: PayloadAction<{ id: number }>) => {
          state.isLoading = false;
          state.changeRequests = state.changeRequests.filter(
            (request) => request.id !== action.payload.id
          );
          state.changeRequestsByLead = state.changeRequestsByLead.filter(
            (request) => request.id !== action.payload.id
          );
        }
      )
      .addCase(rejectChangeRequestThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to reject change request";
      });
  },
});

export const { clearError } = changeRequestSlice.actions;
export default changeRequestSlice.reducer;
