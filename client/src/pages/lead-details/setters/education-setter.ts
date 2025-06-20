import { Lead } from "@/types/lead";

export interface EducationData {
  bacObtention: string;
  bacCountry: string;
  bacType: string;
  israeliBacSchool: string;
  frenchBacSchoolIsrael: string;
  otherSchoolName: string;
  jewishSchool: string;
  frenchBacSchoolFrance: string;
  academicDiploma: string;
  higherEducationCountry: string;
  universityNameHebrew: string;
  diplomaNameHebrew: string;
  universityNameFrench: string;
  diplomaNameFrench: string;
}

export function processEducationData(
  leadData: Partial<Lead>
): Partial<EducationData> {
  const educationData: Partial<EducationData> = {
    bacObtention: leadData.bacObtention || "",
    bacCountry: leadData.bacCountry || "",
    bacType: leadData.bacType || "",
    israeliBacSchool: leadData.israeliBacSchool || "",
    frenchBacSchoolIsrael: leadData.frenchBacSchoolIsrael || "",
    otherSchoolName: leadData.otherSchoolName || "",
    jewishSchool: leadData.jewishSchool || "",
    frenchBacSchoolFrance: leadData.frenchBacSchoolFrance || "",
    academicDiploma: leadData.academicDiploma || "",
    higherEducationCountry: leadData.higherEducationCountry || "",
    universityNameHebrew: leadData.universityNameHebrew || "",
    diplomaNameHebrew: leadData.diplomaNameHebrew || "",
    universityNameFrench: leadData.universityNameFrench || "",
    diplomaNameFrench: leadData.diplomaNameFrench || "",
  };

  // Si pas de BAC, vider tous les champs liés au BAC
  if (educationData.bacObtention === "Non") {
    educationData.bacCountry = "";
    educationData.bacType = "";
    educationData.israeliBacSchool = "";
    educationData.frenchBacSchoolIsrael = "";
    educationData.otherSchoolName = "";
    educationData.jewishSchool = "";
    educationData.frenchBacSchoolFrance = "";
  }

  if (educationData.bacCountry !== "Israel") {
    educationData.bacType = "";
    educationData.israeliBacSchool = "";
    educationData.frenchBacSchoolIsrael = "";
    educationData.otherSchoolName = "";
  }

  if (educationData.bacCountry !== "Étranger") {
    educationData.jewishSchool = "";
    educationData.frenchBacSchoolFrance = "";
  }

  if (educationData.bacType !== "BAC israélien") {
    educationData.israeliBacSchool = "";
    educationData.otherSchoolName = "";
  }

  if (educationData.bacType !== "BAC étranger") {
    educationData.frenchBacSchoolIsrael = "";
  }

  if (educationData.jewishSchool !== "Oui") {
    educationData.frenchBacSchoolFrance = "";
  }

  if (educationData.academicDiploma === "Non") {
    educationData.higherEducationCountry = "";
    educationData.universityNameHebrew = "";
    educationData.diplomaNameHebrew = "";
    educationData.universityNameFrench = "";
    educationData.diplomaNameFrench = "";
  }

  if (educationData.higherEducationCountry !== "Israël") {
    educationData.universityNameHebrew = "";
    educationData.diplomaNameHebrew = "";
  }

  if (educationData.higherEducationCountry !== "À l'étranger") {
    educationData.universityNameFrench = "";
    educationData.diplomaNameFrench = "";
  }

  return educationData;
}
