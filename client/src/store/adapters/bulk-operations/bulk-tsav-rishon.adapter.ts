import { API_ROUTES } from "@/constants/api-routes";

const M2M_TOKEN = import.meta.env.VITE_API_M2M_TOKEN;

export interface BulkTsavRishonRequest {
  leadIds: number[];
  daparNote?: string;
  medicalProfile?: string;
  hebrewScore?: string;
  tsavRishonStatus?: string;
  recruitmentCenter?: string;
  tsavRishonDate?: string;
  tsavRishonGradesReceived?: string;
}

export interface BulkTsavRishonResponse {
  updated: number;
  failed: number;
  errors: string[];
}

export const bulkUpdateTsavRishon = async (
  data: BulkTsavRishonRequest
): Promise<BulkTsavRishonResponse> => {
  try {
    const response = await fetch(API_ROUTES.BULK_TSAV_RISHON, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${M2M_TOKEN}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to perform bulk Tsav Rishon update");
    }

    return response.json();
  } catch (error) {
    console.error("Error performing bulk Tsav Rishon update:", error);
    throw error;
  }
};
