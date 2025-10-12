import { API_ROUTES } from "@/constants/api-routes";

export interface ActiviteConf {
  id: number;
  activiteType: number;
  firstName: string;
  lastName: string;
  isFuturSoldier: boolean;
  phoneNumber: string;
  mail: string;
  lead_id: number;
  hasArrived: boolean;
}

const M2M_TOKEN = import.meta.env.VITE_API_M2M_TOKEN;

export const getActiviteConfByActivityTypeAdapter = async (
  activityType: number
): Promise<ActiviteConf[]> => {
  try {
    const response = await fetch(
      `${API_ROUTES.ACTIVITE_CONF}/by-activite-type/${activityType}`,
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
    console.log("ActiviteConf fetch successful:", result);
    return result;
  } catch (error) {
    console.error("ActiviteConf fetch failed:", error);
    throw error;
  }
};

export const getActiviteConfByLeadIdAdapter = async (
  leadId: number
): Promise<ActiviteConf[]> => {
  try {
    const response = await fetch(
      `${API_ROUTES.ACTIVITE_CONF}/by-lead/${leadId}`,
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
    console.log("ActiviteConf by lead fetch successful:", result);
    return result;
  } catch (error) {
    console.error("ActiviteConf by lead fetch failed:", error);
    throw error;
  }
};

export const updateActiviteConfAdapter = async (
  id: number,
  updates: Partial<ActiviteConf>
): Promise<ActiviteConf> => {
  try {
    const response = await fetch(`${API_ROUTES.ACTIVITE_CONF}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${M2M_TOKEN}`,
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const result = await response.json();
    console.log("ActiviteConf update successful:", result);
    return result;
  } catch (error) {
    console.error("ActiviteConf update failed:", error);
    throw error;
  }
};

export const createActiviteConfAdapter = async (
  activiteConf: Omit<ActiviteConf, "id" | "hasArrived">
): Promise<ActiviteConf> => {
  try {
    const response = await fetch(`${API_ROUTES.ACTIVITE_CONF}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${M2M_TOKEN}`,
      },
      body: JSON.stringify({
        ...activiteConf,
        hasArrived: false, // Default to not arrived
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const result = await response.json();
    console.log("ActiviteConf create successful:", result);
    return result;
  } catch (error) {
    console.error("ActiviteConf create failed:", error);
    throw error;
  }
};
