import { API_ROUTES } from "@/constants/api-routes";

const M2M_TOKEN = import.meta.env.VITE_API_M2M_TOKEN;

export interface MonthlyData {
  [key: string]: number;
}

export const fetchMonthlyData = async (): Promise<MonthlyData> => {
  try {
    const response = await fetch(`${API_ROUTES.DASHBOARD_CHART_MONTHLY}`, {
      headers: {
        Authorization: `Bearer ${M2M_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch monthly data");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching monthly data:", error);
    throw error;
  }
};
