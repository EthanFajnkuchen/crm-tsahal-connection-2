import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchExpertCoStatsThunk } from "../../thunks/expert-connection/expert-co-stats.thunk";
import { ExpertCoStats } from "../../adapters/expert-connection/expert-co-stats.adapter";

interface ExpertCoStatsState {
  data: ExpertCoStats | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  isPopupOpen: boolean;
  selectedCardApiKey: string | null;
  isLoading: boolean;
  error: string | null;
}

const loadPopupState = () => {
  try {
    const savedState = localStorage.getItem("expertCoPopupState");
    return savedState
      ? JSON.parse(savedState)
      : { isPopupOpen: false, selectedCardApiKey: null };
  } catch {
    return { isPopupOpen: false, selectedCardApiKey: null };
  }
};

const savePopupState = (state: ExpertCoStatsState) => {
  localStorage.setItem(
    "expertCoPopupState",
    JSON.stringify({
      isPopupOpen: state.isPopupOpen,
      selectedCardApiKey: state.selectedCardApiKey,
    })
  );
};

const initialState: ExpertCoStatsState = {
  data: null,
  status: "idle",
  isLoading: false,
  error: null,
  ...loadPopupState(),
};

const expertCoStatsSlice = createSlice({
  name: "expertCoStats",
  initialState,
  reducers: {
    openPopup: (state, action: PayloadAction<string>) => {
      state.isPopupOpen = true;
      state.selectedCardApiKey = action.payload;
      savePopupState(state);
    },
    closePopup: (state) => {
      state.isPopupOpen = false;
      state.selectedCardApiKey = null;
      savePopupState(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpertCoStatsThunk.pending, (state) => {
        state.isLoading = true;
        state.status = "loading";
      })
      .addCase(fetchExpertCoStatsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchExpertCoStatsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.status = "failed";
        state.error =
          action.error.message ??
          "Failed to fetch expert connection statistics";
      });
  },
});

export const { openPopup, closePopup } = expertCoStatsSlice.actions;
export default expertCoStatsSlice.reducer;
