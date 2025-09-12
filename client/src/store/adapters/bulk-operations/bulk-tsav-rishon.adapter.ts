import { API_ROUTES } from "@/constants/api-routes";

const M2M_TOKEN = import.meta.env.VITE_API_M2M_TOKEN;

export interface BulkTsavRishonGradesRequest {
  leadIds: number[];
  daparNote?: string;
  medicalProfile?: string;
  hebrewScore?: string;
  tsavRishonGradesReceived?: string;
}

export interface BulkTsavRishonDateRequest {
  leadIds: number[];
  tsavRishonDate: string;
  recruitmentCenter: string;
}

export interface BulkTsavRishonResponse {
  updated: number;
  failed: number;
  errors: string[];
}

export const bulkUpdateTsavRishonGrades = async (
  data: BulkTsavRishonGradesRequest
): Promise<BulkTsavRishonResponse> => {
  try {
    const response = await fetch(API_ROUTES.BULK_TSAV_RISHON_GRADES, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${M2M_TOKEN}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to perform bulk Tsav Rishon grades update");
    }

    return response.json();
  } catch (error) {
    console.error("Error performing bulk Tsav Rishon grades update:", error);
    throw error;
  }
};

export const bulkUpdateTsavRishonDate = async (
  data: BulkTsavRishonDateRequest
): Promise<BulkTsavRishonResponse> => {
  try {
    const response = await fetch(API_ROUTES.BULK_TSAV_RISHON_DATE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${M2M_TOKEN}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to perform bulk Tsav Rishon date update");
    }

    return response.json();
  } catch (error) {
    console.error("Error performing bulk Tsav Rishon date update:", error);
    throw error;
  }
};
