import { createSlice } from "@reduxjs/toolkit";
import { downloadLeadsThunk } from "@/store/thunks/data/excel.thunk";

interface DownloadLeadsState {
  file: Blob | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: DownloadLeadsState = {
  file: null,
  isLoading: false,
  error: null,
};

const downloadLeadsSlice = createSlice({
  name: "downloadLeads",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(downloadLeadsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(downloadLeadsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.file = action.payload;
      })
      .addCase(downloadLeadsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default downloadLeadsSlice.reducer;
