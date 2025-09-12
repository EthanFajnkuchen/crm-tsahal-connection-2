import { API_ROUTES } from "@/constants/api-routes";

const M2M_TOKEN = import.meta.env.VITE_API_M2M_TOKEN;

export interface Lead {
  ID: number;
  dateInscription: string;
  email?: string;
  firstName: string;
  lastName: string;
  statutCandidat: string;
}

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
