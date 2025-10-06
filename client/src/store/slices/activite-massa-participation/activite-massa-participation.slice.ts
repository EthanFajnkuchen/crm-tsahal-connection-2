import { createSlice } from "@reduxjs/toolkit";
import { ActiviteMassaParticipation } from "@/store/adapters/activite-massa-participation/activite-massa-participation.adapter";
import {
  createActiviteMassaParticipationThunk,
  getActiviteMassaParticipationThunk,
  getActiviteMassaParticipationByActiviteMassaThunk,
  getActiviteMassaParticipationByLeadThunk,
  deleteActiviteMassaParticipationThunk,
} from "@/store/thunks/activite-massa-participation/activite-massa-participation.thunk";

interface ActiviteMassaParticipationState {
  activiteMassaParticipations: ActiviteMassaParticipation[];
  isLoading: boolean;
  isCreating: boolean;
  isDeleting: boolean;
  error: string | null;
}

const initialState: ActiviteMassaParticipationState = {
  activiteMassaParticipations: [],
  isLoading: false,
  isCreating: false,
  isDeleting: false,
  error: null,
};

const activiteMassaParticipationSlice = createSlice({
  name: "activiteMassaParticipation",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearActiviteMassaParticipations: (state) => {
      state.activiteMassaParticipations = [];
    },
  },
  extraReducers: (builder) => {
    // Create activite massa participation
    builder
      .addCase(createActiviteMassaParticipationThunk.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(
        createActiviteMassaParticipationThunk.fulfilled,
        (state, action) => {
          state.isCreating = false;
          state.activiteMassaParticipations.unshift(action.payload);
        }
      )
      .addCase(
        createActiviteMassaParticipationThunk.rejected,
        (state, action) => {
          state.isCreating = false;
          state.error =
            action.error.message ||
            "Failed to create activite massa participation";
        }
      )
      // Get activite massa participations
      .addCase(getActiviteMassaParticipationThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getActiviteMassaParticipationThunk.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.activiteMassaParticipations = action.payload;
        }
      )
      .addCase(getActiviteMassaParticipationThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message ||
          "Failed to fetch activite massa participations";
      })
      // Get activite massa participations by activite massa
      .addCase(
        getActiviteMassaParticipationByActiviteMassaThunk.pending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addCase(
        getActiviteMassaParticipationByActiviteMassaThunk.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.activiteMassaParticipations = action.payload;
        }
      )
      .addCase(
        getActiviteMassaParticipationByActiviteMassaThunk.rejected,
        (state, action) => {
          state.isLoading = false;
          state.error =
            action.error.message ||
            "Failed to fetch activite massa participations by activite massa";
        }
      )
      // Get activite massa participations by lead
      .addCase(getActiviteMassaParticipationByLeadThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getActiviteMassaParticipationByLeadThunk.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.activiteMassaParticipations = action.payload;
        }
      )
      .addCase(
        getActiviteMassaParticipationByLeadThunk.rejected,
        (state, action) => {
          state.isLoading = false;
          state.error =
            action.error.message ||
            "Failed to fetch activite massa participations by lead";
        }
      )
      // Delete activite massa participation
      .addCase(deleteActiviteMassaParticipationThunk.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(
        deleteActiviteMassaParticipationThunk.fulfilled,
        (state, action) => {
          state.isDeleting = false;
          state.activiteMassaParticipations =
            state.activiteMassaParticipations.filter(
              (participation) => participation.id !== action.payload
            );
        }
      )
      .addCase(
        deleteActiviteMassaParticipationThunk.rejected,
        (state, action) => {
          state.isDeleting = false;
          state.error =
            action.error.message ||
            "Failed to delete activite massa participation";
        }
      );
  },
});

export const { clearError, clearActiviteMassaParticipations } =
  activiteMassaParticipationSlice.actions;
export default activiteMassaParticipationSlice.reducer;
