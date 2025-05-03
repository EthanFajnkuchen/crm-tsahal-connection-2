import { API_ROUTES } from "@/constants/api-routes";
import { Lead } from "@/types/lead";

const M2M_TOKEN = import.meta.env.VITE_API_M2M_TOKEN;

export const searchLeads = async (query: string): Promise<Lead[]> => {
  try {
    const response = await fetch(
      `${API_ROUTES.DATA_TABLE_LEADS}search?input=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `Bearer ${M2M_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to search leads");
    }

    return response.json();
  } catch (error) {
    console.error("Error searching leads:", error);
    throw error;
  }
};
