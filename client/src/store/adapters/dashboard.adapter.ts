import { API_ROUTES } from "@/constants/api-routes";

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
}> => {
  try {
    const [monthlyResponse, yearlyResponse, leadsResponse] = await Promise.all([
      fetch(`${API_ROUTES.DASHBOARD_CHART_MONTHLY}`),
      fetch(`${API_ROUTES.DASHBOARD_CHART_YEARLY}`),
      fetch(`${API_ROUTES.DASHBOARD_LAST_TEN_LEADS}`),
    ]);

    if (!monthlyResponse.ok || !yearlyResponse.ok || !leadsResponse.ok) {
      throw new Error("Failed to fetch dashboard data");
    }

    const monthlyData: MonthlyData = await monthlyResponse.json();
    const yearlyData: YearlyData = await yearlyResponse.json();
    const lastTenLeads: Lead[] = await leadsResponse.json();

    return { monthlyData, yearlyData, lastTenLeads };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};
