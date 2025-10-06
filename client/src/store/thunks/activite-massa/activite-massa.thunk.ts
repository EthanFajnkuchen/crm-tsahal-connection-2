import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createActiviteMassaAdapter,
  getActiviteMassaAdapter,
  updateActiviteMassaAdapter,
  deleteActiviteMassaAdapter,
  ActiviteMassaData,
  CreateActiviteMassaResponse,
  ActiviteMassa,
} from "@/store/adapters/activite-massa/activite-massa.adapter";

export const createActiviteMassaThunk = createAsyncThunk<
  CreateActiviteMassaResponse,
  ActiviteMassaData
>("activiteMassa/create", async (activiteMassaData: ActiviteMassaData) => {
  return await createActiviteMassaAdapter(activiteMassaData);
});

export const getActiviteMassaThunk = createAsyncThunk<
  ActiviteMassa[],
  { id_activite_type?: number; programYear?: string; date?: string }
>("activiteMassa/getAll", async ({ id_activite_type, programYear, date }) => {
  return await getActiviteMassaAdapter(id_activite_type, programYear, date);
});

export const updateActiviteMassaThunk = createAsyncThunk<
  ActiviteMassa,
  { id: number; data: { date: string } }
>("activiteMassa/update", async ({ id, data }) => {
  return await updateActiviteMassaAdapter(id, data);
});

export const deleteActiviteMassaThunk = createAsyncThunk<number, number>(
  "activiteMassa/delete",
  async (id: number) => {
    await deleteActiviteMassaAdapter(id);
    return id;
  }
);
