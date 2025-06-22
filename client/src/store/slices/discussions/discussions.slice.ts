import { createSlice } from "@reduxjs/toolkit";
import { Discussion } from "@/types/discussion";
import {
  fetchDiscussionsByLeadIdThunk,
  createDiscussionThunk,
  updateDiscussionThunk,
  deleteDiscussionThunk,
} from "../../thunks/discussions/discussions.thunk";

interface DiscussionsState {
  discussions: Discussion[];
  status: "idle" | "loading" | "succeeded" | "failed";
  isLoading: boolean;
  error: string | null;
  createStatus: "idle" | "loading" | "succeeded" | "failed";
  isCreating: boolean;
  createError: string | null;
  updateStatus: "idle" | "loading" | "succeeded" | "failed";
  isUpdating: boolean;
  updateError: string | null;
  deleteStatus: "idle" | "loading" | "succeeded" | "failed";
  isDeleting: boolean;
  deleteError: string | null;
  currentLeadId: number | null;
}

const initialState: DiscussionsState = {
  discussions: [],
  status: "idle",
  isLoading: false,
  error: null,
  createStatus: "idle",
  isCreating: false,
  createError: null,
  updateStatus: "idle",
  isUpdating: false,
  updateError: null,
  deleteStatus: "idle",
  isDeleting: false,
  deleteError: null,
  currentLeadId: null,
};

const discussionsSlice = createSlice({
  name: "discussions",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
    },
    resetStatuses: (state) => {
      state.createStatus = "idle";
      state.updateStatus = "idle";
      state.deleteStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    // Fetch discussions
    builder
      .addCase(fetchDiscussionsByLeadIdThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDiscussionsByLeadIdThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isLoading = false;
        state.discussions = action.payload.discussions;
        state.currentLeadId = action.payload.leadId;
        state.error = null;
      })
      .addCase(fetchDiscussionsByLeadIdThunk.rejected, (state, action) => {
        state.status = "failed";
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create discussion
    builder
      .addCase(createDiscussionThunk.pending, (state) => {
        state.createStatus = "loading";
        state.isCreating = true;
        state.createError = null;
      })
      .addCase(createDiscussionThunk.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.isCreating = false;
        state.discussions.unshift(action.payload); // Add to beginning (most recent first)
        state.createError = null;
      })
      .addCase(createDiscussionThunk.rejected, (state, action) => {
        state.createStatus = "failed";
        state.isCreating = false;
        state.createError = action.payload as string;
      });

    // Update discussion
    builder
      .addCase(updateDiscussionThunk.pending, (state) => {
        state.updateStatus = "loading";
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(updateDiscussionThunk.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        state.isUpdating = false;
        const index = state.discussions.findIndex(
          (discussion) => discussion.ID === action.payload.ID
        );
        if (index !== -1) {
          state.discussions[index] = action.payload;
        }
        state.updateError = null;
      })
      .addCase(updateDiscussionThunk.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.isUpdating = false;
        state.updateError = action.payload as string;
      });

    // Delete discussion
    builder
      .addCase(deleteDiscussionThunk.pending, (state) => {
        state.deleteStatus = "loading";
        state.isDeleting = true;
        state.deleteError = null;
      })
      .addCase(deleteDiscussionThunk.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.isDeleting = false;
        state.discussions = state.discussions.filter(
          (discussion) => discussion.ID !== action.payload
        );
        state.deleteError = null;
      })
      .addCase(deleteDiscussionThunk.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.isDeleting = false;
        state.deleteError = action.payload as string;
      });
  },
});

export const { clearErrors, resetStatuses } = discussionsSlice.actions;
export default discussionsSlice.reducer;
