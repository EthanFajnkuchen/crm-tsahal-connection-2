import { API_ROUTES } from "@/constants/api-routes";

const M2M_TOKEN = import.meta.env.VITE_API_M2M_TOKEN;

export const fetchCardLeads = async (): Promise<Record<string, number>> => {
  try {
    const response = await fetch(`${API_ROUTES.DASHBOARD_CARD_LEADS}`, {
      headers: {
        Authorization: `Bearer ${M2M_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch card leads");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching card leads:", error);
    throw error;
  }
};
