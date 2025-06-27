import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchTafkidim,
  TafkidimData,
} from "../../adapters/tafkidim/tafkidim.adapter";

export const fetchTafkidimThunk = createAsyncThunk<TafkidimData>(
  "tafkidim/fetchTafkidim",
  async () => {
    return await fetchTafkidim();
  }
);
