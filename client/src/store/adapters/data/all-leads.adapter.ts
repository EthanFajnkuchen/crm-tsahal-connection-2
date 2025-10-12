import { API_ROUTES } from "@/constants/api-routes";
import { Lead } from "@/types/lead";

const M2M_TOKEN = import.meta.env.VITE_API_M2M_TOKEN;

export const fetchAllLeads = async (): Promise<Lead[]> => {
  try {
    const response = await fetch(`${API_ROUTES.DATA_TABLE_LEADS}`, {
      headers: {
        Authorization: `Bearer ${M2M_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch all leads");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching all leads:", error);
    throw error;
  }
};
