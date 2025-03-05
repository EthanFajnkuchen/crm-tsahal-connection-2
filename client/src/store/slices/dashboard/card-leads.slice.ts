import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchCardLeadsThunk } from "../../thunks/dashboard/card-leads.thunk";

interface CardLeadsState {
  data: Record<string, number> | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  isLoading: boolean;
  error: string | null;
  isPopupOpen: boolean;
  selectedCardApiKey: string | null;
}

const loadPopupState = () => {
  try {
    const savedState = localStorage.getItem("popupState");
    return savedState
      ? JSON.parse(savedState)
      : { isPopupOpen: false, selectedCardApiKey: null };
  } catch {
    return { isPopupOpen: false, selectedCardApiKey: null };
  }
};

const savePopupState = (state: CardLeadsState) => {
  localStorage.setItem(
    "popupState",
    JSON.stringify({
      isPopupOpen: state.isPopupOpen,
      selectedCardApiKey: state.selectedCardApiKey,
    })
  );
};

const initialState: CardLeadsState = {
  data: null,
  status: "idle",
  isLoading: false,
  error: null,
  ...loadPopupState(),
};

const cardLeadsSlice = createSlice({
  name: "cardLeads",
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
      .addCase(fetchCardLeadsThunk.pending, (state) => {
        state.isLoading = true;
        state.status = "loading";
      })
      .addCase(fetchCardLeadsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchCardLeadsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch card leads";
      });
  },
});

export const { openPopup, closePopup } = cardLeadsSlice.actions;
export default cardLeadsSlice.reducer;
