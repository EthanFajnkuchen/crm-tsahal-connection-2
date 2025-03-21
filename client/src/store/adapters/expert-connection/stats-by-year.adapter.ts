import { API_ROUTES } from "@/constants/api-routes";

const M2M_TOKEN = import.meta.env.VITE_API_M2M_TOKEN;

export interface MonthlyStats {
  massa: number;
  other: number;
}

export type ExpertCoYearlyStats = Record<string, Record<string, MonthlyStats>>;

export const fetchExpertCoStatsByYear =
  async (): Promise<ExpertCoYearlyStats> => {
    const response = await fetch(API_ROUTES.EXPERT_CO_STATS_BY_YEAR, {
      headers: {
        Authorization: `Bearer ${M2M_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch expert co stats by year");
    }

    return await response.json();
  };
