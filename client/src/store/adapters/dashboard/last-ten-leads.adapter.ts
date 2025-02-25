import { API_ROUTES } from "@/constants/api-routes";

const M2M_TOKEN = import.meta.env.VITE_API_M2M_TOKEN;

export interface Lead {
  dateInscription: string;
  email: string;
  firstName: string;
  lastName: string;
  statutCandidat: string;
}

export const fetchLastTenLeads = async (): Promise<Lead[]> => {
  try {
    const response = await fetch(`${API_ROUTES.DASHBOARD_LAST_TEN_LEADS}`, {
      headers: {
        Authorization: `Bearer ${M2M_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch last ten leads");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching last ten leads:", error);
    throw error;
  }
};
