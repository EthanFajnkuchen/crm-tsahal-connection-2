import { API_ROUTES } from "@/constants/api-routes";

const M2M_TOKEN = import.meta.env.VITE_API_M2M_TOKEN;

export type FilteredLead = Record<string, any>;

export interface LeadFilterDto {
  included: Record<string, string[]>;
  excluded: Record<string, string[]>;
  fieldsToSend: string[];
}

const normalizeLeadsData = (leads: Record<string, any>[]): FilteredLead[] => {
  return leads.map((lead) => {
    const normalizedLead: FilteredLead = {};
    Object.keys(lead).forEach((key) => {
      const newKey = key.replace(/^lead_/, "");
      normalizedLead[newKey] = lead[key];
    });
    return normalizedLead;
  });
};

export const fetchFilteredLeads = async (
  filters: LeadFilterDto
): Promise<FilteredLead[]> => {
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
      throw new Error("Failed to fetch filtered leads");
    }

    const rawData = await response.json();
    return normalizeLeadsData(rawData);
  } catch (error) {
    console.error("Error fetching filtered leads:", error);
    throw error;
  }
};
