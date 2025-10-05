import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createActivityAdapter,
  getActivitiesAdapter,
  updateActivityAdapter,
  deleteActivityAdapter,
  ActivityData,
  CreateActivityResponse,
  UpdateActivityData,
  Activity,
} from "@/store/adapters/activity/activity.adapter";

export const createActivityThunk = createAsyncThunk<
  CreateActivityResponse,
  ActivityData
>("activity/create", async (activityData: ActivityData) => {
  return await createActivityAdapter(activityData);
});

export const getActivitiesThunk = createAsyncThunk<
  Activity[],
  string | undefined
>("activity/getAll", async (category?: string) => {
  return await getActivitiesAdapter(category);
});

export const updateActivityThunk = createAsyncThunk<
  Activity,
  { id: number; data: UpdateActivityData }
>("activity/update", async ({ id, data }) => {
  return await updateActivityAdapter(id, data);
});

export const deleteActivityThunk = createAsyncThunk<number, number>(
  "activity/delete",
  async (id: number) => {
    await deleteActivityAdapter(id);
    return id;
  }
);
