import { API_ROUTES } from "@/constants/api-routes";
const M2M_TOKEN = import.meta.env.VITE_API_M2M_TOKEN;

export interface MonthlyData {
  [key: string]: number;
}

export interface YearlyData {
  [key: string]: number;
}

export interface Lead {
  dateInscription: string;
  email: string;
  firstName: string;
  lastName: string;
  statutCandidat: string;
}

export const fetchDashboardDataFromApi = async (): Promise<{
  monthlyData: MonthlyData;
  yearlyData: YearlyData;
  lastTenLeads: Lead[];
  cardLeads: Record<string, number>;
}> => {
  try {
    const [monthlyResponse, yearlyResponse, leadsResponse, cardLeadsResponse] =
      await Promise.all([
        fetch(`${API_ROUTES.DASHBOARD_CHART_MONTHLY}`, {
          headers: {
            Authorization: `Bearer ${M2M_TOKEN}`,
          },
        }),
        fetch(`${API_ROUTES.DASHBOARD_CHART_YEARLY}`, {
          headers: {
            Authorization: `Bearer ${M2M_TOKEN}`,
          },
        }),
        fetch(`${API_ROUTES.DASHBOARD_LAST_TEN_LEADS}`, {
          headers: {
            Authorization: `Bearer ${M2M_TOKEN}`,
          },
        }),
        fetch(`${API_ROUTES.DASHBOARD_CARD_LEADS}`, {
          headers: {
            Authorization: `Bearer ${M2M_TOKEN}`,
          },
        }),
      ]);

    if (!monthlyResponse.ok || !yearlyResponse.ok || !leadsResponse.ok) {
      throw new Error("Failed to fetch dashboard data");
    }

    const monthlyData: MonthlyData = await monthlyResponse.json();
    const yearlyData: YearlyData = await yearlyResponse.json();
    const lastTenLeads: Lead[] = await leadsResponse.json();
    const cardLeads: Record<string, number> = await cardLeadsResponse.json();

    return { monthlyData, yearlyData, lastTenLeads, cardLeads };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};
