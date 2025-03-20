import { API_ROUTES } from "@/constants/api-routes";

const M2M_TOKEN = import.meta.env.VITE_API_M2M_TOKEN;

export interface ProductStats {
  [key: string]: number;
}

export const fetchProductStats = async (
  current: boolean
): Promise<ProductStats> => {
  try {
    const response = await fetch(
      `${API_ROUTES.EXPERT_CO_CHARTS}?current=${current}`,
      {
        headers: {
          Authorization: `Bearer ${M2M_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch expert co product statistics");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching expert co product statistics:", error);
    throw error;
  }
};
