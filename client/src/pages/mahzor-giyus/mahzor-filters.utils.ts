import { Lead } from "@/types/lead";

export interface MahzorFilters {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  currentStatus?: string;
  typeGiyus?: string;
  pikoud?: string;
  city?: string;
}

export const filterMahzorLeads = (
  leads: Lead[],
  filters: MahzorFilters
): Lead[] => {
  return leads.filter((lead) => {
    // Filtre de recherche par nom/prénom/email
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const fullName = `${lead.firstName} ${lead.lastName}`.toLowerCase();
      const email = (lead.email || "").toLowerCase();
      if (!fullName.includes(searchLower) && !email.includes(searchLower)) {
        return false;
      }
    }

    // Filtre par date de giyus (début)
    if (filters.dateFrom && lead.giyusDate) {
      const leadDate = new Date(lead.giyusDate);
      const filterDate = new Date(filters.dateFrom);
      if (leadDate < filterDate) {
        return false;
      }
    }

    // Filtre par date de giyus (fin)
    if (filters.dateTo && lead.giyusDate) {
      const leadDate = new Date(lead.giyusDate);
      const filterDate = new Date(filters.dateTo);
      if (leadDate > filterDate) {
        return false;
      }
    }

    // Filtre par statut actuel
    if (filters.currentStatus && filters.currentStatus !== "all") {
      if (lead.currentStatus !== filters.currentStatus) {
        return false;
      }
    }

    // Filtre par type giyus
    if (filters.typeGiyus && filters.typeGiyus !== "all") {
      if (lead.typeGiyus !== filters.typeGiyus) {
        return false;
      }
    }

    // Filtre par pikoud
    if (filters.pikoud && filters.pikoud !== "all") {
      if (lead.pikoud !== filters.pikoud) {
        return false;
      }
    }

    // Filtre par ville
    if (filters.city) {
      const cityLower = filters.city.toLowerCase();
      const leadCity = (lead.city || "").toLowerCase();
      if (!leadCity.includes(cityLower)) {
        return false;
      }
    }

    return true;
  });
};
