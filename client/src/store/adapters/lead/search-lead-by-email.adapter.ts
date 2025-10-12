import { API_ROUTES } from "@/constants/api-routes";

export interface Lead {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface ApiLead {
  id: number;
  lead_firstName?: string;
  lead_lastName?: string;
  lead_email?: string;
  lead_phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
}

const M2M_TOKEN = import.meta.env.VITE_API_M2M_TOKEN;

export const searchLeadByEmailAdapter = async (
  email: string
): Promise<ApiLead[]> => {
  try {
    const response = await fetch(`${API_ROUTES.FILTERED_LEADS}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${M2M_TOKEN}`,
      },
      body: JSON.stringify({
        included: {
          email: [email],
        },
        fieldsToSend: ["id", "firstName", "lastName", "email", "phoneNumber"],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const result = await response.json();
    console.log("Lead search by email successful:", result);
    return result;
  } catch (error) {
    console.error("Lead search by email failed:", error);
    throw error;
  }
};
