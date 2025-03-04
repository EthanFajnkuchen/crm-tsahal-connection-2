import { API_ROUTES } from "@/constants/api-routes";

const M2M_TOKEN = import.meta.env.VITE_API_M2M_TOKEN;

export interface Lead {
  id: string;
  dateInscription: string;
  email?: string;
  firstName: string;
  lastName: string;
  statutCandidat: string;
}

export const searchLeads = async (searchInput: string): Promise<Lead[]> => {
  try {
    const response = await fetch(
      `${API_ROUTES.DATA_TABLE_LEADS}search?input=${encodeURIComponent(
        searchInput
      )}`,
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
