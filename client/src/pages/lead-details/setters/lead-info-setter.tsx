import { Lead } from "@/types/lead";

export interface LeadInfoData {
  firstName: string;
  lastName: string;
  statutCandidat: string;
  currentStatus: string;
  phoneNumber: string;
  whatsappNumber: string;
  email: string;
  mahzorGiyus: string;
  typePoste: string;
  soldierAloneStatus: string;
  giyusDate: string;
  typeGiyus: string;
  nomPoste: string;
  pikoud: string;
  dateFinService: string;
  mahalPath: string;
  serviceType: string;
  armyEntryDateStatus: string;
}

export function processLeadInfoData(
  leadData: Partial<Lead>,
  mahzorGiyus?: string,
  typeGiyus?: string
): Partial<LeadInfoData> {
  const leadInfoData: Partial<LeadInfoData> = {
    firstName: leadData.firstName || "",
    lastName: leadData.lastName || "",
    statutCandidat: leadData.statutCandidat || "",
    currentStatus: leadData.currentStatus || "",
    phoneNumber: leadData.phoneNumber || "",
    whatsappNumber: leadData.whatsappNumber || "",
    email: leadData.email || "",
    mahzorGiyus: mahzorGiyus || leadData.mahzorGiyus || "",
    typePoste: leadData.typePoste || "",
    soldierAloneStatus: leadData.soldierAloneStatus || "",
    giyusDate: leadData.giyusDate || "",
    typeGiyus: typeGiyus || leadData.typeGiyus || "",
    nomPoste: leadData.nomPoste || "",
    pikoud: leadData.pikoud || "",
    dateFinService: leadData.dateFinService || "",
    mahalPath: leadData.mahalPath || "",
    serviceType: leadData.serviceType || "",
    armyEntryDateStatus: leadData.giyusDate ? "Oui" : "Non",
  };

  // Si statutCandidat est "Ne répond pas / Ne sait pas" ou "Pas de notre ressort"
  if (
    leadInfoData.statutCandidat === "Ne répond pas / Ne sait pas" ||
    leadInfoData.statutCandidat === "Pas de notre ressort"
  ) {
    leadInfoData.currentStatus = "";
  }

  // Si currentStatus passe en abandon ou exemption, vider armyEntryDateStatus et giyusDate
  if (
    leadInfoData.currentStatus === "Abandon avant le service" ||
    leadInfoData.currentStatus === "Exemption medical" ||
    leadInfoData.currentStatus === "Exemption religieuse" ||
    leadInfoData.currentStatus === "Exemption (autre)"
  ) {
    leadInfoData.armyEntryDateStatus = "";
    leadInfoData.giyusDate = "";
  }

  // Si giyusDate est vide, vider aussi mahzorGiyus et typeGiyus
  if (leadInfoData.giyusDate === "") {
    leadInfoData.mahzorGiyus = "";
    leadInfoData.typeGiyus = "";
  }

  return leadInfoData;
}
