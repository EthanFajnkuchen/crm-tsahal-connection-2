import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchCardLeadsThunk } from "../../thunks/dashboard/card-leads.thunk";

interface CardLeadsState {
  data: Record<string, number> | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  isPopupOpen: boolean;
  selectedCardApiKey: string | null;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
}

const loadPopupState = () => {
  try {
    const savedState = localStorage.getItem("popupState");
    return savedState
      ? JSON.parse(savedState)
      : { isPopupOpen: false, selectedCardApiKey: null, currentPage: 0 };
  } catch {
    return { isPopupOpen: false, selectedCardApiKey: null, currentPage: 0 };
  }
};

const savePopupState = (state: CardLeadsState) => {
  localStorage.setItem(
    "popupState",
    JSON.stringify({
      isPopupOpen: state.isPopupOpen,
      selectedCardApiKey: state.selectedCardApiKey,
      currentPage: state.currentPage,
    })
  );
};

const initialState: CardLeadsState = {
  data: null,
  status: "idle",
  isLoading: false,
  error: null,
  currentPage: 0,
  ...loadPopupState(),
};

const cardLeadsSlice = createSlice({
  name: "cardLeads",
  initialState,
  reducers: {
    openPopup: (state, action: PayloadAction<string>) => {
      state.isPopupOpen = true;
      state.selectedCardApiKey = action.payload;
      // Réinitialiser la page à 0 lors de l'ouverture d'un nouveau popup
      state.currentPage = 0;
      savePopupState(state);
    },
    closePopup: (state) => {
      state.isPopupOpen = false;
      state.selectedCardApiKey = null;
      state.currentPage = 0;
      savePopupState(state);
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
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

export const { openPopup, closePopup, setCurrentPage } = cardLeadsSlice.actions;
export default cardLeadsSlice.reducer;
