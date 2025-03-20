import { API_ROUTES } from "@/constants/api-routes";

const M2M_TOKEN = import.meta.env.VITE_API_M2M_TOKEN;

export interface ExpertCoStats {
  expertCoTotal: number;
  expertCoActuel: number;
}

export const fetchExpertCoStats = async (): Promise<ExpertCoStats> => {
  try {
    const response = await fetch(`${API_ROUTES.EXPERT_CO_STATS}`, {
      headers: {
        Authorization: `Bearer ${M2M_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch expert connection statistics");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching expert connection statistics:", error);
    throw error;
  }
};
