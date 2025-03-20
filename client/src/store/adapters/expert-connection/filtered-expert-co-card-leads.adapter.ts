import { API_ROUTES } from "@/constants/api-routes";

const M2M_TOKEN = import.meta.env.VITE_API_M2M_TOKEN;

export type ExpertCoFilteredLead = Record<string, any>;

export interface ExpertCoLeadFilterDto {
  included: Record<string, string[]>;
  excluded: Record<string, string[]>;
  fieldsToSend: string[];
}

const normalizeExpertCoLeadsData = (
  leads: Record<string, any>[]
): ExpertCoFilteredLead[] => {
  return leads.map((lead) => {
    const normalizedLead: ExpertCoFilteredLead = {};
    Object.keys(lead).forEach((key) => {
      const newKey = key.replace(/^lead_/, "");
      normalizedLead[newKey] = lead[key];
    });
    return normalizedLead;
  });
};

export const fetchExpertCoFilteredLeads = async (
  filters: ExpertCoLeadFilterDto
): Promise<ExpertCoFilteredLead[]> => {
  try {
    const response = await fetch(`${API_ROUTES.FILTERED_LEADS}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${M2M_TOKEN}`,
      },
      body: JSON.stringify(filters),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch expert co filtered leads");
    }

    const rawData = await response.json();
    return normalizeExpertCoLeadsData(rawData);
  } catch (error) {
    console.error("Error fetching expert co filtered leads:", error);
    throw error;
  }
};
