import { Lead } from "@/types/lead";

export interface LeadFilters {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  statutCandidat?: string;
}

export const filterLeads = (leads: Lead[], filters: LeadFilters): Lead[] => {
  const filtered = leads.filter((lead) => {
    // Filtre de recherche par nom/prénom
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const fullName = `${lead.firstName} ${lead.lastName}`.toLowerCase();
      if (!fullName.includes(searchLower)) {
        return false;
      }
    }

    // Filtre par date d'inscription (début)
    if (filters.dateFrom) {
      const leadDate = new Date(lead.dateInscription);
      const filterDate = new Date(filters.dateFrom);
      if (leadDate < filterDate) {
        return false;
      }
    }

    // Filtre par date d'inscription (fin)
    if (filters.dateTo) {
      const leadDate = new Date(lead.dateInscription);
      const filterDate = new Date(filters.dateTo);
      if (leadDate > filterDate) {
        return false;
      }
    }

    // Filtre par statut
    if (filters.statutCandidat && filters.statutCandidat !== "all") {
      const filterStatut = filters.statutCandidat.trim();
      const leadStatut = (lead.statutCandidat || "").trim();
      if (leadStatut !== filterStatut) {
        return false;
      }
    }

    return true;
  });

  return filtered;
};
