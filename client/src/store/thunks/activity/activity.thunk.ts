import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createActivityAdapter,
  getActivitiesAdapter,
  ActivityData,
  CreateActivityResponse,
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
