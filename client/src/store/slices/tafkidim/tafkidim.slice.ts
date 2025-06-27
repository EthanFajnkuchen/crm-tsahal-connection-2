import { createSlice } from "@reduxjs/toolkit";
import { fetchTafkidimThunk } from "../../thunks/tafkidim/tafkidim.thunk";
import { TafkidimData } from "../../adapters/tafkidim/tafkidim.adapter";

interface TafkidimState {
  data: TafkidimData | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  isLoading: boolean;
  error: string | null;
}

const initialState: TafkidimState = {
  data: null,
  status: "idle",
  isLoading: false,
  error: null,
};

const tafkidimSlice = createSlice({
  name: "tafkidim",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTafkidimThunk.pending, (state) => {
        state.isLoading = true;
        state.status = "loading";
      })
      .addCase(fetchTafkidimThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchTafkidimThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch tafkidim";
      });
  },
});

export default tafkidimSlice.reducer;
