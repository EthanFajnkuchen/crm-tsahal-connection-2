import { API_ROUTES } from "@/constants/api-routes";
import {
  Discussion,
  CreateDiscussionDto,
  UpdateDiscussionDto,
} from "@/types/discussion";

const M2M_TOKEN = import.meta.env.VITE_API_M2M_TOKEN;

export const fetchDiscussionsByLeadId = async (
  leadId: number
): Promise<Discussion[]> => {
  try {
    const response = await fetch(
      `${API_ROUTES.DISCUSSIONS_BY_LEAD}/${leadId}`,
      {
        headers: {
          Authorization: `Bearer ${M2M_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch discussions");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching discussions:", error);
    throw error;
  }
};

export const createDiscussion = async (
  discussionData: CreateDiscussionDto
): Promise<Discussion> => {
  try {
    const response = await fetch(`${API_ROUTES.DISCUSSIONS}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${M2M_TOKEN}`,
      },
      body: JSON.stringify(discussionData),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to create discussion");
    }

    return response.json();
  } catch (error) {
    console.error("Error creating discussion:", error);
    throw error;
  }
};

export const updateDiscussion = async (
  id: number,
  updateData: UpdateDiscussionDto
): Promise<Discussion> => {
  try {
    const response = await fetch(`${API_ROUTES.DISCUSSIONS}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${M2M_TOKEN}`,
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error("Failed to update discussion");
    }

    return response.json();
  } catch (error) {
    console.error("Error updating discussion:", error);
    throw error;
  }
};

export const deleteDiscussion = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_ROUTES.DISCUSSIONS}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${M2M_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete discussion");
    }
  } catch (error) {
    console.error("Error deleting discussion:", error);
    throw error;
  }
};
