import { MahzorGiyusCounts } from "@/store/adapters/mahzor-giyus/mahzor-giyus.adapter";
import { fetchMahzorGiyusCountsThunk } from "@/store/thunks/mahzor-giyus/mahzor-giyus.thunk";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MahzorGiyusState {
  data: MahzorGiyusCounts | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  isLoading: boolean;
  error: string | null;
  isPopupOpen: boolean;
  selectedCardKey: string | null;
  currentPage: number;
}

const loadPopupState = () => {
  try {
    const savedState = localStorage.getItem("mahzorPopupState");
    return savedState
      ? JSON.parse(savedState)
      : { isPopupOpen: false, selectedCardKey: null, currentPage: 0 };
  } catch {
    return { isPopupOpen: false, selectedCardKey: null, currentPage: 0 };
  }
};

const savePopupState = (state: MahzorGiyusState) => {
  localStorage.setItem(
    "mahzorPopupState",
    JSON.stringify({
      isPopupOpen: state.isPopupOpen,
      selectedCardKey: state.selectedCardKey,
      currentPage: state.currentPage,
    })
  );
};

const initialState: MahzorGiyusState = {
  data: null,
  status: "idle",
  isLoading: false,
  error: null,
  currentPage: 0,
  ...loadPopupState(),
};

const mahzorGiyusSlice = createSlice({
  name: "mahzorGiyus",
  initialState,
  reducers: {
    openPopup: (state, action: PayloadAction<string>) => {
      state.isPopupOpen = true;
      state.selectedCardKey = action.payload;
      // Réinitialiser la page à 0 lors de l'ouverture d'un nouveau popup
      state.currentPage = 0;
      savePopupState(state);
    },
    closePopup: (state) => {
      state.isPopupOpen = false;
      state.selectedCardKey = null;
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
      .addCase(fetchMahzorGiyusCountsThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMahzorGiyusCountsThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchMahzorGiyusCountsThunk.rejected, (state, action) => {
        state.status = "failed";
        state.isLoading = false;
        state.error =
          action.error.message ?? "Failed to fetch Mahzor Giyus counts";
      });
  },
});

export const { openPopup, closePopup, setCurrentPage } =
  mahzorGiyusSlice.actions;
export default mahzorGiyusSlice.reducer;
