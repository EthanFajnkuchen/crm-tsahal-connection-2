import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchMahzorGiyusCounts,
  MahzorGiyusCounts,
} from "@/store/adapters/mahzor-giyus/mahzor-giyus.adapter";

export const fetchMahzorGiyusCountsThunk = createAsyncThunk<MahzorGiyusCounts>(
  "mahzorGiyusCounts/fetch",
  async () => {
    return await fetchMahzorGiyusCounts();
  }
);
