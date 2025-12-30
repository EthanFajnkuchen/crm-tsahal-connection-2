import { API_ROUTES } from "@/constants/api-routes";
import { Lead } from "@/types/lead";

const M2M_TOKEN = import.meta.env.VITE_API_M2M_TOKEN;

interface SearchFilters {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  statutCandidat?: string;
}

export const searchLeads = async (filters: SearchFilters): Promise<Lead[]> => {
  try {
    const response = await fetch(`${API_ROUTES.DATA_TABLE_LEADS}/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${M2M_TOKEN}`,
      },
      body: JSON.stringify(filters),
    });

    if (!response.ok) {
      throw new Error("Failed to search leads");
    }

    return response.json();
  } catch (error) {
    console.error("Error searching leads:", error);
    throw error;
  }
};
