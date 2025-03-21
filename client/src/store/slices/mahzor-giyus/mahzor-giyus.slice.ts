import { MahzorGiyusCounts } from "@/store/adapters/mahzor-giyus/mahzor-giyus.adapter";
import { fetchMahzorGiyusCountsThunk } from "@/store/thunks/mahzor-giyus/mahzor-giyus.thunk";
import { createSlice } from "@reduxjs/toolkit";

interface MahzorGiyusState {
  data: MahzorGiyusCounts | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  isLoading: boolean;
  error: string | null;
}

const initialState: MahzorGiyusState = {
  data: null,
  status: "idle",
  isLoading: false,
  error: null,
};

const mahzorGiyusSlice = createSlice({
  name: "mahzorGiyusCounts",
  initialState,
  reducers: {},
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

export default mahzorGiyusSlice.reducer;
