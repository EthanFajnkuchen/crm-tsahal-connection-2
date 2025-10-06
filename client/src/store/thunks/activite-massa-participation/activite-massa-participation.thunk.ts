import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createActiviteMassaParticipationAdapter,
  getActiviteMassaParticipationAdapter,
  getActiviteMassaParticipationByActiviteMassaAdapter,
  getActiviteMassaParticipationByLeadAdapter,
  deleteActiviteMassaParticipationAdapter,
  ActiviteMassaParticipationData,
  CreateActiviteMassaParticipationResponse,
  ActiviteMassaParticipation,
} from "@/store/adapters/activite-massa-participation/activite-massa-participation.adapter";

export const createActiviteMassaParticipationThunk = createAsyncThunk<
  CreateActiviteMassaParticipationResponse,
  ActiviteMassaParticipationData
>(
  "activiteMassaParticipation/create",
  async (data: ActiviteMassaParticipationData) => {
    return await createActiviteMassaParticipationAdapter(data);
  }
);

export const getActiviteMassaParticipationThunk = createAsyncThunk<
  ActiviteMassaParticipation[],
  { id_activite_massa?: number; lead_id?: number }
>(
  "activiteMassaParticipation/getAll",
  async ({ id_activite_massa, lead_id }) => {
    return await getActiviteMassaParticipationAdapter(
      id_activite_massa,
      lead_id
    );
  }
);

export const getActiviteMassaParticipationByActiviteMassaThunk =
  createAsyncThunk<ActiviteMassaParticipation[], number>(
    "activiteMassaParticipation/getByActiviteMassa",
    async (id_activite_massa: number) => {
      return await getActiviteMassaParticipationByActiviteMassaAdapter(
        id_activite_massa
      );
    }
  );

export const getActiviteMassaParticipationByLeadThunk = createAsyncThunk<
  ActiviteMassaParticipation[],
  number
>("activiteMassaParticipation/getByLead", async (lead_id: number) => {
  return await getActiviteMassaParticipationByLeadAdapter(lead_id);
});

export const deleteActiviteMassaParticipationThunk = createAsyncThunk<
  number,
  number
>("activiteMassaParticipation/delete", async (id: number) => {
  await deleteActiviteMassaParticipationAdapter(id);
  return id;
});
