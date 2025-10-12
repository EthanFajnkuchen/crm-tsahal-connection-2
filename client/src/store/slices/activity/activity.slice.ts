import { createSlice } from "@reduxjs/toolkit";
import { Activity } from "@/store/adapters/activity/activity.adapter";
import {
  createActivityThunk,
  getActivitiesThunk,
  updateActivityThunk,
  deleteActivityThunk,
} from "@/store/thunks/activity/activity.thunk";

interface ActivityState {
  activities: Activity[];
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
}

const initialState: ActivityState = {
  activities: [],
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
};

const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearActivities: (state) => {
      state.activities = [];
    },
  },
  extraReducers: (builder) => {
    // Create activity
    builder
      .addCase(createActivityThunk.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createActivityThunk.fulfilled, (state, action) => {
        state.isCreating = false;
        state.activities.unshift(action.payload); // Add new activity at the beginning
      })
      .addCase(createActivityThunk.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.error.message || "Failed to create activity";
      })
      // Get activities
      .addCase(getActivitiesThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getActivitiesThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activities = action.payload;
      })
      .addCase(getActivitiesThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch activities";
      })
      // Update activity
      .addCase(updateActivityThunk.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateActivityThunk.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.activities.findIndex(
          (activity) => activity.id === action.payload.id
        );
        if (index !== -1) {
          state.activities[index] = action.payload;
        }
      })
      .addCase(updateActivityThunk.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.error.message || "Failed to update activity";
      })
      // Delete activity
      .addCase(deleteActivityThunk.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteActivityThunk.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.activities = state.activities.filter(
          (activity) => activity.id !== action.payload
        );
      })
      .addCase(deleteActivityThunk.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.error.message || "Failed to delete activity";
      });
  },
});

export const { clearError, clearActivities } = activitySlice.actions;
export default activitySlice.reducer;
