import { API_ROUTES } from "@/constants/api-routes";

export interface ActiviteMassaParticipationData {
  id_activite_massa: number;
  lead_id: number;
}

export interface ActiviteMassaParticipation {
  id: number;
  id_activite_massa: number;
  lead_id: number;
  lead?: {
    ID: number;
    firstName: string;
    lastName: string;
    programName: string;
    schoolYears: string;
  };
  activiteMassa?: {
    id: number;
    programName: string;
    programYear: string;
    date: string;
  };
}

export interface CreateActiviteMassaParticipationResponse {
  id: number;
  id_activite_massa: number;
  lead_id: number;
}

const M2M_TOKEN = import.meta.env.VITE_API_M2M_TOKEN;

export const createActiviteMassaParticipationAdapter = async (
  data: ActiviteMassaParticipationData
): Promise<CreateActiviteMassaParticipationResponse> => {
  try {
    const response = await fetch(API_ROUTES.ACTIVITE_MASSA_PARTICIPATION, {
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
    return result;
  } catch (error) {
    console.error("ActiviteMassaParticipation creation failed:", error);
    throw error;
  }
};

export const getActiviteMassaParticipationAdapter = async (
  id_activite_massa?: number,
  lead_id?: number
): Promise<ActiviteMassaParticipation[]> => {
  try {
    const url = new URL(API_ROUTES.ACTIVITE_MASSA_PARTICIPATION);
    if (id_activite_massa) {
      url.searchParams.set("id_activite_massa", id_activite_massa.toString());
    }
    if (lead_id) {
      url.searchParams.set("lead_id", lead_id.toString());
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
    return result;
  } catch (error) {
    console.error("ActiviteMassaParticipation fetch failed:", error);
    throw error;
  }
};

export const getActiviteMassaParticipationByActiviteMassaAdapter = async (
  id_activite_massa: number
): Promise<ActiviteMassaParticipation[]> => {
  try {
    const response = await fetch(
      `${API_ROUTES.ACTIVITE_MASSA_PARTICIPATION}/by-activite-massa/${id_activite_massa}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${M2M_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(
      "ActiviteMassaParticipation by activite massa fetch failed:",
      error
    );
    throw error;
  }
};

export const getActiviteMassaParticipationByLeadAdapter = async (
  lead_id: number
): Promise<ActiviteMassaParticipation[]> => {
  try {
    const response = await fetch(
      `${API_ROUTES.ACTIVITE_MASSA_PARTICIPATION}/by-lead/${lead_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${M2M_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("ActiviteMassaParticipation by lead fetch failed:", error);
    throw error;
  }
};

export const deleteActiviteMassaParticipationAdapter = async (
  id: number
): Promise<void> => {
  try {
    const response = await fetch(
      `${API_ROUTES.ACTIVITE_MASSA_PARTICIPATION}/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${M2M_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }
  } catch (error) {
    console.error("ActiviteMassaParticipation deletion failed:", error);
    throw error;
  }
};
