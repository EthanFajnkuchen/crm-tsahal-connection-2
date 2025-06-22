import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  Discussion,
  CreateDiscussionDto,
  UpdateDiscussionDto,
} from "@/types/discussion";
import {
  fetchDiscussionsByLeadId,
  createDiscussion,
  updateDiscussion,
  deleteDiscussion,
} from "../../adapters/discussions/discussions.adapter";

// Fetch discussions by lead ID
export const fetchDiscussionsByLeadIdThunk = createAsyncThunk<
  { discussions: Discussion[]; leadId: number },
  number,
  { rejectValue: string }
>("discussions/fetchByLeadId", async (leadId, { rejectWithValue }) => {
  try {
    const discussions = await fetchDiscussionsByLeadId(leadId);
    return { discussions, leadId };
  } catch (error) {
    console.error("Error fetching discussions:", error);
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to fetch discussions"
    );
  }
});

// Create discussion
export const createDiscussionThunk = createAsyncThunk<
  Discussion,
  CreateDiscussionDto,
  { rejectValue: string }
>("discussions/create", async (discussionData, { rejectWithValue }) => {
  try {
    const discussion = await createDiscussion(discussionData);
    return discussion;
  } catch (error) {
    console.error("Error creating discussion:", error);
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to create discussion"
    );
  }
});

// Update discussion
export const updateDiscussionThunk = createAsyncThunk<
  Discussion,
  { id: number; updateData: UpdateDiscussionDto },
  { rejectValue: string }
>("discussions/update", async ({ id, updateData }, { rejectWithValue }) => {
  try {
    const discussion = await updateDiscussion(id, updateData);
    return discussion;
  } catch (error) {
    console.error("Error updating discussion:", error);
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to update discussion"
    );
  }
});

// Delete discussion
export const deleteDiscussionThunk = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("discussions/delete", async (id, { rejectWithValue }) => {
  try {
    await deleteDiscussion(id);
    return id;
  } catch (error) {
    console.error("Error deleting discussion:", error);
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to delete discussion"
    );
  }
});
