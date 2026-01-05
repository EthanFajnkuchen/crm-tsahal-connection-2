import { Lead } from "@/types/lead";

export interface LeadFilters {
  [key: string]: string | undefined;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  statutCandidat?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  passportNumber1?: string;
  expertConnection?: string;
  statutLoiRetour?: string;
  currentStatus?: string;
  city?: string;
  soldierAloneStatus?: string;
  bacObtention?: string;
  dateFinService?: string;
  pikoud?: string;
  nomPoste?: string;
  typePoste?: string;
  typeGiyus?: string;
  giyusDate?: string;
  mahzorGiyus?: string;
}

export const hasActiveFilters = (
  filters: LeadFilters
): boolean => {
  // Vérifier les filtres principaux
  return Object.values(filters).some(
    (value) => value !== undefined && value !== "" && value !== "all"
  );
};

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
