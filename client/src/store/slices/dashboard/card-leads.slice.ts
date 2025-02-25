import { createSlice } from "@reduxjs/toolkit";
import { fetchCardLeadsThunk } from "../../thunks/dashboard/card-leads.thunk";

interface CardLeadsState {
  data: Record<string, number> | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  isLoading: boolean;
  error: string | null;
}

const initialState: CardLeadsState = {
  data: null,
  status: "idle",
  isLoading: false,
  error: null,
};

const cardLeadsSlice = createSlice({
  name: "cardLeads",
  initialState,
  reducers: {},
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

export default cardLeadsSlice.reducer;
