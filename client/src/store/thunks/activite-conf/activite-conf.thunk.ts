import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getActiviteConfByActivityTypeAdapter,
  getActiviteConfByLeadIdAdapter,
  updateActiviteConfAdapter,
  ActiviteConf,
} from "@/store/adapters/activite-conf/activite-conf.adapter";

export const getActiviteConfByActivityTypeThunk = createAsyncThunk<
  ActiviteConf[],
  number
>("activiteConf/getByActivityType", async (activityType: number) => {
  return await getActiviteConfByActivityTypeAdapter(activityType);
});

export const getActiviteConfByLeadIdThunk = createAsyncThunk<
  ActiviteConf[],
  number
>("activiteConf/getByLeadId", async (leadId: number) => {
  return await getActiviteConfByLeadIdAdapter(leadId);
});

export const updateActiviteConfThunk = createAsyncThunk<
  ActiviteConf,
  { id: number; updates: Partial<ActiviteConf> }
>("activiteConf/update", async ({ id, updates }) => {
  return await updateActiviteConfAdapter(id, updates);
});
