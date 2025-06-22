import { Lead } from "@/types/lead";

export interface TsahalData {
  currentStatus: string;
  soldierAloneStatus: string;
  serviceType: string;
  mahalPath: string;
  studyPath: string;
  tsavRishonStatus: string;
  recruitmentCenter: string;
  tsavRishonDate: string;
  tsavRishonGradesReceived: string;
  daparNote: string;
  medicalProfile: string;
  hebrewScore: string;
  yomHameaStatus: string;
  yomHameaDate: string;
  yomSayerotStatus: string;
  yomSayerotDate: string;
  armyEntryDateStatus: string;
  giyusDate: string;
  michveAlonTraining: string;
  mahzorGiyus: string;
  typeGiyus: string;
}

export function processTsahalData(
  leadData: Partial<Lead>,
  mahzorGiyus: string,
  typeGiyus: string
): Partial<TsahalData> {
  const tsahalData: Partial<TsahalData> = {
    currentStatus: leadData.currentStatus || "",
    soldierAloneStatus: leadData.soldierAloneStatus || "",
    serviceType: leadData.serviceType || "",
    mahalPath: leadData.mahalPath || "",
    studyPath: leadData.studyPath || "",
    tsavRishonStatus: leadData.tsavRishonStatus || "",
    recruitmentCenter: leadData.recruitmentCenter || "",
    tsavRishonDate: leadData.tsavRishonDate || "",
    tsavRishonGradesReceived: leadData.tsavRishonGradesReceived || "",
    daparNote: leadData.daparNote || "",
    medicalProfile: leadData.medicalProfile || "",
    hebrewScore: leadData.hebrewScore || "",
    yomHameaStatus: leadData.yomHameaStatus || "",
    yomHameaDate: leadData.yomHameaDate || "",
    yomSayerotStatus: leadData.yomSayerotStatus || "",
    yomSayerotDate: leadData.yomSayerotDate || "",
    armyEntryDateStatus: leadData.armyEntryDateStatus || "",
    giyusDate: leadData.giyusDate || "",
    michveAlonTraining: leadData.michveAlonTraining || "",
    mahzorGiyus: mahzorGiyus,
    typeGiyus: typeGiyus,
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
}
