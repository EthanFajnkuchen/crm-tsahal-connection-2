import { API_ROUTES } from "@/constants/api-routes";
import { Lead } from "@/types/lead";

const M2M_TOKEN = import.meta.env.VITE_API_M2M_TOKEN;

export type LeadDetails = Lead;

export const fetchLeadDetails = async (id: string): Promise<Lead> => {
  try {
    const response = await fetch(`${API_ROUTES.LEAD_DETAILS}/${id}`, {
      headers: {
        Authorization: `Bearer ${M2M_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch lead details");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching lead details:", error);
    throw error;
  }
};

export const updateLead = async (
  id: string,
  updateData: Partial<Lead>
): Promise<Lead> => {
  try {
    const response = await fetch(`${API_ROUTES.UPDATE_LEAD}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${M2M_TOKEN}`,
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error("Failed to update lead");
    }

    return response.json();
  } catch (error) {
    console.error("Error updating lead:", error);
    throw error;
  }
};
