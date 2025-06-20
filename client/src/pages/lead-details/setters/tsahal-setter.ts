import { Lead } from "@/types/lead";

export interface TsahalData {
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
}

export function processTsahalData(
  leadData: Partial<Lead>
): Partial<TsahalData> {
  const tsahalData: Partial<TsahalData> = {
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
  }

  return tsahalData;
}
