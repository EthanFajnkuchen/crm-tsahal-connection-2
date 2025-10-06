import { API_ROUTES } from "@/constants/api-routes";

export interface ActiviteMassaData {
  id_activite_type: number;
  programName: string;
  programYear: string;
  date: string;
}

export interface ActiviteMassa {
  id: number;
  id_activite_type: number;
  programName: string;
  programYear: string;
  date: string;
}

export interface CreateActiviteMassaResponse {
  id: number;
  id_activite_type: number;
  programName: string;
  programYear: string;
  date: string;
}

const M2M_TOKEN = import.meta.env.VITE_API_M2M_TOKEN;

export const createActiviteMassaAdapter = async (
  data: ActiviteMassaData
): Promise<CreateActiviteMassaResponse> => {
  try {
    const response = await fetch(API_ROUTES.ACTIVITE_MASSA, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${M2M_TOKEN}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const result = await response.json();
    console.log("ActiviteMassa creation successful:", result);
    return result;
  } catch (error) {
    console.error("ActiviteMassa creation failed:", error);
    throw error;
  }
};

export const getActiviteMassaAdapter = async (
  id_activite_type?: number,
  programYear?: string,
  date?: string
): Promise<ActiviteMassa[]> => {
  try {
    const url = new URL(API_ROUTES.ACTIVITE_MASSA);
    if (id_activite_type) {
      url.searchParams.set("id_activite_type", id_activite_type.toString());
    }
    if (programYear) {
      url.searchParams.set("programYear", programYear);
    }
    if (date) {
      url.searchParams.set("date", date);
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${M2M_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const result = await response.json();
    console.log("ActiviteMassa fetch successful:", result);
    return result;
  } catch (error) {
    console.error("ActiviteMassa fetch failed:", error);
    throw error;
  }
};
