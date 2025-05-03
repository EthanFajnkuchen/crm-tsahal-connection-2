import { API_ROUTES } from "@/constants/api-routes";
import { Lead } from "@/types/lead";

const M2M_TOKEN = import.meta.env.VITE_API_M2M_TOKEN;

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
