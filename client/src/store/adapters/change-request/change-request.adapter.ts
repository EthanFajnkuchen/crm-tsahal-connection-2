import { CreateChangeRequestDto, ChangeRequest } from "@/types/change-request";
import { API_ROUTES } from "@/constants/api-routes";
const M2M_TOKEN = import.meta.env.VITE_API_M2M_TOKEN;

export const changeRequestAdapter = {
  createChangeRequest: async (data: CreateChangeRequestDto) => {
    const response = await fetch(API_ROUTES.CHANGE_REQUESTS, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${M2M_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create change request");
    }

    return response.json();
  },

  getChangeRequests: async () => {
    const response = await fetch(API_ROUTES.CHANGE_REQUESTS, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${M2M_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch change requests");
    }

    return response.json();
  },

  getChangeRequestsByLeadId: async (leadId: number) => {
    const response = await fetch(
      `${API_ROUTES.CHANGE_REQUESTS_BY_LEAD}/${leadId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${M2M_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch change requests by lead");
    }

    return response.json();
  },

  deleteChangeRequest: async (id: number) => {
    const response = await fetch(`${API_ROUTES.CHANGE_REQUESTS}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${M2M_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete change request");
    }

    return { id };
  },

  acceptChangeRequest: async (changeRequest: ChangeRequest) => {
    // Update the lead with the new value
    const updateData = {
      [changeRequest.fieldChanged]: changeRequest.newValue
    };
    
    const updateResponse = await fetch(`${API_ROUTES.UPDATE_LEAD}/${changeRequest.leadId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${M2M_TOKEN}`,
      },
      body: JSON.stringify(updateData),
    });

    if (!updateResponse.ok) {
      throw new Error("Failed to update lead");
    }

    // Delete the change request
    const deleteResponse = await fetch(`${API_ROUTES.CHANGE_REQUESTS}/${changeRequest.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${M2M_TOKEN}`,
      },
    });

    if (!deleteResponse.ok) {
      throw new Error("Failed to delete change request after update");
    }

    return { id: changeRequest.id, updatedLead: await updateResponse.json() };
  },

  rejectChangeRequest: async (id: number) => {
    const response = await fetch(`${API_ROUTES.CHANGE_REQUESTS}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${M2M_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to reject change request");
    }

    return { id };
  },
};
