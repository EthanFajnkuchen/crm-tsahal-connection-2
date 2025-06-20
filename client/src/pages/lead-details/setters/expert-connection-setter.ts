import { Lead } from "@/types/lead";

export interface ExpertConnectionData {
  expertConnection: string;
  produitEC1: string;
  produitEC2: string;
  produitEC3: string;
  produitEC4: string;
  produitEC5: string;
  dateProduitEC1: string;
  dateProduitEC2: string;
  dateProduitEC3: string;
  dateProduitEC4: string;
  dateProduitEC5: string;
}

export function processExpertConnectionData(
  leadData: Partial<Lead>
): Partial<ExpertConnectionData> {
  const expertConnectionData: Partial<ExpertConnectionData> = {
    expertConnection: leadData.expertConnection || "",
    produitEC1: leadData.produitEC1 || "",
    produitEC2: leadData.produitEC2 || "",
    produitEC3: leadData.produitEC3 || "",
    produitEC4: leadData.produitEC4 || "",
    produitEC5: leadData.produitEC5 || "",
    dateProduitEC1: leadData.dateProduitEC1 || "",
    dateProduitEC2: leadData.dateProduitEC2 || "",
    dateProduitEC3: leadData.dateProduitEC3 || "",
    dateProduitEC4: leadData.dateProduitEC4 || "",
    dateProduitEC5: leadData.dateProduitEC5 || "",
  };

  // Si expertConnection est "Non", vider tous les champs liés
  if (expertConnectionData.expertConnection === "Non") {
    expertConnectionData.produitEC1 = "";
    expertConnectionData.produitEC2 = "";
    expertConnectionData.produitEC3 = "";
    expertConnectionData.produitEC4 = "";
    expertConnectionData.produitEC5 = "";
    expertConnectionData.dateProduitEC1 = "";
    expertConnectionData.dateProduitEC2 = "";
    expertConnectionData.dateProduitEC3 = "";
    expertConnectionData.dateProduitEC4 = "";
    expertConnectionData.dateProduitEC5 = "";
  }

  return expertConnectionData;
}
