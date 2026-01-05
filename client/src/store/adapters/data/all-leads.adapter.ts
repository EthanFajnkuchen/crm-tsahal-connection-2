import { API_ROUTES } from "@/constants/api-routes";
import { Lead } from "@/types/lead";

const M2M_TOKEN = import.meta.env.VITE_API_M2M_TOKEN;

interface FetchLeadsResponse {
  data: Lead[];
  total: number;
}

interface LeadFilters {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  statutCandidat?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  passportNumber1?: string;
  expertConnection?: string;
  statutLoiRetour?: string;
  currentStatus?: string;
  [key: string]: string | undefined;
}

export const fetchAllLeads = async (
  page: number,
  limit: number = 15,
  filters?: LeadFilters
): Promise<FetchLeadsResponse> => {
  try {
    // Construire les paramètres de requête
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    // Ajouter les filtres s'ils existent
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all") {
          params.append(key, value);
        }
      });
    }

    const response = await fetch(
      `${API_ROUTES.DATA_TABLE_LEADS}?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${M2M_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch all leads");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching all leads:", error);
    throw error;
  }
};
