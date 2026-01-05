import { API_ROUTES } from "@/constants/api-routes";

const M2M_TOKEN = import.meta.env.VITE_API_M2M_TOKEN;

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

export const downloadLeads = async (filters?: LeadFilters): Promise<Blob> => {
  let url = API_ROUTES.DOWNLOAD_LEADS;

  // Construire les query params à partir des filtres
  if (filters) {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all") {
        queryParams.append(key, value);
      }
    });

    if (queryParams.toString()) {
      url = `${url}?${queryParams.toString()}`;
    }
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${M2M_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to download leads");
  }

  return await response.blob();
};
