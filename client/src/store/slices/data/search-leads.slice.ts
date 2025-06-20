import { createSlice } from "@reduxjs/toolkit";
import { searchLeadsThunk } from "../../thunks/data/search-leads.thunk";
import { Lead } from "@/types/lead";

interface SearchLeadsState {
  data: Lead[] | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  isLoading: boolean;
  error: string | null;
}

const initialState: SearchLeadsState = {
  data: null,
  status: "idle",
  isLoading: false,
  error: null,
};

const searchLeadsSlice = createSlice({
  name: "searchLeads",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchLeadsThunk.pending, (state) => {
        state.isLoading = true;
        state.status = "loading";
      })
      .addCase(searchLeadsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(searchLeadsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.status = "failed";
        state.error = action.error.message ?? "Failed to search leads";
      });
  },
});

export default searchLeadsSlice.reducer;
