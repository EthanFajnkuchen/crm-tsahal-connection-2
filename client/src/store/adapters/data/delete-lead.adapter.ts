import { API_ROUTES } from "@/constants/api-routes";

const M2M_TOKEN = import.meta.env.VITE_API_M2M_TOKEN;

export const deleteLead = async (
  leadId: number
): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const response = await fetch(`${API_ROUTES.DATA_TABLE_LEADS}/${leadId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${M2M_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete lead");
    }

    return response.json();
  } catch (error) {
    console.error("Error deleting lead:", error);
    throw error;
  }
};
