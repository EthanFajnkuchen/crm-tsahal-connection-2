import { API_ROUTES } from "@/constants/api-routes";

export interface BulkGiyusData {
  leadIds: number[];
  giyusDate: string;
  michveAlonTraining?: string;
}

export interface BulkGiyusResponse {
  updated: number;
  failed: number;
  errors: string[];
}

const M2M_TOKEN = import.meta.env.VITE_API_M2M_TOKEN;

export const bulkGiyusAdapter = async (
  data: BulkGiyusData
): Promise<BulkGiyusResponse> => {
  try {
    const response = await fetch(API_ROUTES.BULK_GIYUS, {
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
    console.log("Bulk Giyus update successful:", result);
    return result;
  } catch (error) {
    console.error("Bulk Giyus update failed:", error);
    throw error;
  }
};
