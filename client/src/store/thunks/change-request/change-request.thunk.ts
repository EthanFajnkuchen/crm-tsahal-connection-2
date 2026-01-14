import { createAsyncThunk } from "@reduxjs/toolkit";
import { changeRequestAdapter } from "@/store/adapters/change-request/change-request.adapter";
import { CreateChangeRequestDto, ChangeRequest, GroupedChangeRequest } from "@/types/change-request";

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

export const getGroupedChangeRequestsThunk = createAsyncThunk<GroupedChangeRequest[]>(
  "changeRequest/getGrouped",
  async () => {
    return await changeRequestAdapter.getGroupedChangeRequests();
  }
);

export const getChangeRequestsByLeadIdThunk = createAsyncThunk<
  ChangeRequest[],
  number
>("changeRequest/getByLeadId", async (leadId: number) => {
  return await changeRequestAdapter.getChangeRequestsByLeadId(leadId);
});

export const deleteChangeRequestThunk = createAsyncThunk<
  { id: number },
  number
>("changeRequest/delete", async (id: number) => {
  return await changeRequestAdapter.deleteChangeRequest(id);
});

export const acceptChangeRequestThunk = createAsyncThunk<
  { id: number; updatedLead: any },
  ChangeRequest
>("changeRequest/accept", async (changeRequest: ChangeRequest) => {
  return await changeRequestAdapter.acceptChangeRequest(changeRequest);
});

export const rejectChangeRequestThunk = createAsyncThunk<
  { id: number },
  number
>("changeRequest/reject", async (id: number) => {
  return await changeRequestAdapter.rejectChangeRequest(id);
});

// Bulk operations
export const bulkAcceptChangeRequestsThunk = createAsyncThunk<
  {
    successful: number[];
    failed: { id: number; error: string }[];
    totalCount: number;
  },
  ChangeRequest[]
>("changeRequest/bulkAccept", async (changeRequests: ChangeRequest[]) => {
  return await changeRequestAdapter.bulkAcceptChangeRequests(changeRequests);
});

export const bulkRejectChangeRequestsThunk = createAsyncThunk<
  {
    successful: number[];
    failed: { id: number; error: string }[];
    totalCount: number;
  },
  number[]
>("changeRequest/bulkReject", async (ids: number[]) => {
  return await changeRequestAdapter.bulkRejectChangeRequests(ids);
});
