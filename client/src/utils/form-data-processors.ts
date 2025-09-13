import { Lead } from "@/types/lead";

// Education section data processor
export const processEducationData = (data: Partial<Lead>) => {
  const educationData = { ...data };

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
};

// General section data processor
export const processGeneralData = (data: Partial<Lead>) => {
  return {
    ...data,
    isOnlyChild: data.isOnlyChild ? "Oui" : "Non",
  };
};

// Judaism & Nationality section data processor
export const processJudaismNationalityData = (data: Partial<Lead>) => {
  const judaismNationalityData = { ...data };

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
};

// Tsahal section data processor
export const processTsahalData = (
  data: Partial<Lead>,
  mahzorGiyus?: string,
  typeGiyus?: string
) => {
  const tsahalData = {
    ...data,
    mahzorGiyus,
    typeGiyus,
    armyEntryDateStatus: data.giyusDate ? "Oui" : "Non",
  };

  if (tsahalData.serviceType !== "Mahal") {
    tsahalData.mahalPath = "";
  }

  if (tsahalData.serviceType !== "Études") {
    tsahalData.studyPath = "";
  }

  if (tsahalData.tsavRishonStatus === "Non") {
    tsahalData.recruitmentCenter = "";
    tsahalData.tsavRishonDate = "";
    tsahalData.tsavRishonGradesReceived = "";
    tsahalData.daparNote = "";
    tsahalData.medicalProfile = "";
    tsahalData.hebrewScore = "";
  }

  if (tsahalData.tsavRishonGradesReceived === "Non") {
    tsahalData.daparNote = "";
    tsahalData.medicalProfile = "";
    tsahalData.hebrewScore = "";
  }

  if (tsahalData.yomHameaStatus === "Non") {
    tsahalData.yomHameaDate = "";
  }

  if (tsahalData.yomSayerotStatus === "Non") {
    tsahalData.yomSayerotDate = "";
  }

  if (tsahalData.armyEntryDateStatus === "Non") {
    tsahalData.giyusDate = "";
    tsahalData.michveAlonTraining = "";
    tsahalData.mahzorGiyus = "";
    tsahalData.typeGiyus = "";
  }

  if (tsahalData.giyusDate === "") {
    tsahalData.mahzorGiyus = "";
    tsahalData.typeGiyus = "";
  }

  return tsahalData;
};

// Integration Israel section data processor
export const processIntegrationIsraelData = (data: Partial<Lead>) => {
  // Add any specific processing logic here
  return data;
};

// Lead info section data processor
export const processLeadInfoData = (
  data: Partial<Lead>,
  mahzorGiyus?: string,
  typeGiyus?: string
) => {
  const formattedData = {
    ...data,
    mahzorGiyus,
    typeGiyus,
    armyEntryDateStatus: data.giyusDate ? "Oui" : "Non",
  };

  if (
    data.statutCandidat === "Ne répond pas / Ne sait pas" ||
    data.statutCandidat === "Pas de notre ressort"
  ) {
    formattedData.currentStatus = "";
  }

  // Si currentStatus passe en abandon ou exemption, vider armyEntryDateStatus et giyusDate
  if (
    formattedData.currentStatus === "Abandon avant le service" ||
    formattedData.currentStatus === "Exemption medical" ||
    formattedData.currentStatus === "Exemption religieuse" ||
    formattedData.currentStatus === "Exemption (autre)"
  ) {
    formattedData.armyEntryDateStatus = "";
    formattedData.giyusDate = "";
  }

  // Si giyusDate est vide, vider aussi mahzorGiyus et typeGiyus
  if (formattedData.giyusDate === "") {
    formattedData.mahzorGiyus = "";
    formattedData.typeGiyus = "";
  }

  return formattedData;
};

// Expert Connection section data processor
export const processExpertConnectionData = (data: Partial<Lead>) => {
  const expertConnectionData = { ...data };

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
};
