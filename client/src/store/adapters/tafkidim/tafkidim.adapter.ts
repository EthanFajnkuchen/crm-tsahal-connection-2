import { API_ROUTES } from "@/constants/api-routes";

const M2M_TOKEN = import.meta.env.VITE_API_M2M_TOKEN;

export interface TafkidLead {
  id: number;
  fullName: string;
  nomPoste: string;
}

export interface TafkidCategory {
  leads: TafkidLead[];
  total: number;
}

export interface TafkidimData {
  Jobnik: TafkidCategory;
  "Tomeh Lehima": TafkidCategory;
  Lohem: TafkidCategory;
}

export const fetchTafkidim = async (): Promise<TafkidimData> => {
  try {
    const response = await fetch(`${API_ROUTES.DATA_TABLE_LEADS}/tafkidim`, {
      headers: {
        Authorization: `Bearer ${M2M_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch tafkidim");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching tafkidim:", error);
    throw error;
  }
};
