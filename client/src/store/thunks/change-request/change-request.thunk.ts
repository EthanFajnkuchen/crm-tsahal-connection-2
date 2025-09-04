import { createAsyncThunk } from "@reduxjs/toolkit";
import { changeRequestAdapter } from "@/store/adapters/change-request/change-request.adapter";
import { CreateChangeRequestDto, ChangeRequest } from "@/types/change-request";

export const createChangeRequestThunk = createAsyncThunk<
  ChangeRequest,
  CreateChangeRequestDto
>("changeRequest/create", async (data: CreateChangeRequestDto) => {
  return await changeRequestAdapter.createChangeRequest(data);
});

export const getChangeRequestsThunk = createAsyncThunk<ChangeRequest[]>(
  "changeRequest/getAll",
  async () => {
    return await changeRequestAdapter.getChangeRequests();
  }
);

export const getChangeRequestsByLeadIdThunk = createAsyncThunk<
  ChangeRequest[],
  number
>("changeRequest/getByLeadId", async (leadId: number) => {
  return await changeRequestAdapter.getChangeRequestsByLeadId(leadId);
});
