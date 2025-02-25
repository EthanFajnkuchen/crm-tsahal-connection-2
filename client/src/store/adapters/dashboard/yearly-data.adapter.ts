import { API_ROUTES } from "@/constants/api-routes";

const M2M_TOKEN = import.meta.env.VITE_API_M2M_TOKEN;

export interface YearlyData {
  [key: string]: number;
}

export const fetchYearlyData = async (): Promise<YearlyData> => {
  try {
    const response = await fetch(`${API_ROUTES.DASHBOARD_CHART_YEARLY}`, {
      headers: {
        Authorization: `Bearer ${M2M_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch yearly data");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching yearly data:", error);
    throw error;
  }
};
