import { Lead } from "@/types/lead";

export interface JudaismNationalityData {
  StatutLoiRetour: string;
  conversionDate: string;
  conversionAgency: string;
  statutResidentIsrael: string;
  anneeAlyah: string;
  numberOfNationalities: string;
  nationality1: string;
  passportNumber1: string;
  nationality2?: string;
  passportNumber2?: string;
  nationality3?: string;
  passportNumber3?: string;
  hasIsraeliID: string;
  israeliIDNumber: string;
}

export function processJudaismNationalityData(
  leadData: Partial<Lead>
): Partial<JudaismNationalityData> {
  const judaismNationalityData: Partial<JudaismNationalityData> = {
    StatutLoiRetour: leadData.StatutLoiRetour || "",
    conversionDate: leadData.conversionDate || "",
    conversionAgency: leadData.conversionAgency || "",
    statutResidentIsrael: leadData.statutResidentIsrael || "",
    anneeAlyah: leadData.anneeAlyah || "",
    numberOfNationalities: leadData.numberOfNationalities || "",
    nationality1: leadData.nationality1 || "",
    passportNumber1: leadData.passportNumber1 || "",
    nationality2: leadData.nationality2 || "",
    passportNumber2: leadData.passportNumber2 || "",
    nationality3: leadData.nationality3 || "",
    passportNumber3: leadData.passportNumber3 || "",
    hasIsraeliID: leadData.hasIsraeliID || "",
    israeliIDNumber: leadData.israeliIDNumber || "",
  };

  if (judaismNationalityData.StatutLoiRetour !== "Juif converti") {
    judaismNationalityData.conversionDate = "";
    judaismNationalityData.conversionAgency = "";
  }

  if (judaismNationalityData.numberOfNationalities === "1") {
    judaismNationalityData.nationality2 = "";
    judaismNationalityData.passportNumber2 = "";
    judaismNationalityData.nationality3 = "";
    judaismNationalityData.passportNumber3 = "";
  }

  if (judaismNationalityData.numberOfNationalities === "2") {
    judaismNationalityData.nationality3 = "";
    judaismNationalityData.passportNumber3 = "";
  }

  if (
    !["Ole Hadash", "Katin Hozer", "Tochav Hozer"].includes(
      judaismNationalityData.statutResidentIsrael || ""
    )
  ) {
    judaismNationalityData.anneeAlyah = "";
  }

  return judaismNationalityData;
}
