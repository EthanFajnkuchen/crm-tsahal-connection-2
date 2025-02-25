import {
  FileUser,
  ClipboardList,
  TrendingUp,
  Shield,
  UserCheck,
  UserMinus,
  UserX,
  MapPin,
  Globe,
  GraduationCap,
  Clock,
  School,
  Book,
} from "lucide-react";

import { inProgressColumns } from "@/table-columns/in-progress-columns";
import { toTreatColumns } from "@/table-columns/to-treat-columns";
import { MichveAlonColumns } from "@/table-columns/michve-alon-columns";
import { UnityColumns } from "@/table-columns/unity-columns";
import { ReleasedColumns } from "@/table-columns/released-columns";
import { NoResponseColumns } from "@/table-columns/no-response.columns";
import { AbandonBeforeServiceColumns } from "@/table-columns/abandon-before-service-columns";
import { AbandonDuringServiceColumns } from "@/table-columns/abandon-during-service-columns";
import { ResidentIsraelNoFrameworkColumns } from "@/table-columns/resident-israel-no-framework-columns";
import { ProgramAfterBacColumns } from "@/table-columns/program-after-bac-columns";
import { ProgramPreArmyColumns } from "@/table-columns/program-pre-army-columns";
import { YoudAlephColumns } from "@/table-columns/youd-aleph-columns";
import { YoudBethColumns } from "@/table-columns/youd-beth-columns";
import { StudyingOlimColumns } from "@/table-columns/studying-olim-columns";
import { StudyingTouristColumns } from "@/table-columns/studying-tourist-columns";

export const DASHBOARD_CARDS_ITEMS = [
  {
    displayName: "Total",
    apiKey: "totalLeads",
    icon: FileUser,
    bgColor: "bg-[#8950FC]",
    textColor: "text-white",
    filters: {
      included: {},
      excluded: {},
      fieldsToSend: [],
    },
    columns: [],
  },
  {
    displayName: "\u00C0 traiter",
    apiKey: "toTreat",
    icon: ClipboardList,
    bgColor: "bg-white",
    textColor: "text-black",
    filters: {
      included: { statutCandidat: ["À traiter"] },
      excluded: {},
      fieldsToSend: [
        "dateInscription",
        "firstName",
        "lastName",
        "statutResidentIsrael",
        "programName",
        "schoolYears",
        "email",
      ],
    },
    columns: toTreatColumns.columns,
  },
  {
    displayName: "En cours",
    apiKey: "inProgress",
    icon: TrendingUp,
    bgColor: "bg-white",
    textColor: "text-black",
    filters: {
      included: { statutCandidat: ["En cours de traitement"] },
      excluded: {},
      fieldsToSend: [
        "dateInscription",
        "firstName",
        "lastName",
        "giyusDate",
        "programName",
        "schoolYears",
        "email",
      ],
    },
    columns: inProgressColumns.columns,
  },
  {
    displayName: "Michve Alon",
    apiKey: "soldierMichveAlon",
    icon: Shield,
    bgColor: "bg-white",
    textColor: "text-black",
    filters: {
      included: { currentStatus: ["Un soldat - Michve Alon"] },
      excluded: {},
      fieldsToSend: [
        "dateInscription",
        "firstName",
        "lastName",
        "statutCandidat",
        "mahzorGiyus",
        "giyusDate",
        "dateFinService",
        "typePoste",
        "nomPoste",
        "pikoud",
        "expertConnection",
        "email",
      ],
    },
    columns: MichveAlonColumns.columns,
  },
  {
    displayName: "Unit\u00E9",
    apiKey: "soldierUnit",
    icon: UserCheck,
    bgColor: "bg-white",
    textColor: "text-black",
    filters: {
      included: { currentStatus: ["Un soldat - unité"] },
      excluded: {},
      fieldsToSend: [
        "dateInscription",
        "firstName",
        "lastName",
        "statutCandidat",
        "mahzorGiyus",
        "giyusDate",
        "dateFinService",
        "typePoste",
        "nomPoste",
        "pikoud",
        "expertConnection",
        "email",
      ],
    },
    columns: UnityColumns.columns,
  },
  {
    displayName: "Soldats lib\u00E9r\u00E9s",
    apiKey: "soldierReleased",
    icon: UserMinus,
    bgColor: "bg-white",
    textColor: "text-black",
    filters: {
      included: { currentStatus: ["Un soldat libéré"] },
      excluded: {},
      fieldsToSend: [
        "dateInscription",
        "firstName",
        "lastName",
        "statutCandidat",
        "mahzorGiyus",
        "giyusDate",
        "dateFinService",
        "typePoste",
        "nomPoste",
        "pikoud",
        "expertConnection",
        "email",
      ],
    },
    columns: ReleasedColumns.columns,
  },
  {
    displayName: "Sans r\u00E9ponse/pas de notre ressort",
    apiKey: "noResponse",
    icon: UserX,
    bgColor: "bg-white",
    textColor: "text-black",
    filters: {
      included: {
        statutCandidat: ["Pas de notre ressort", "Ne répond pas/Ne sait pas"],
      },
      excluded: {},
      fieldsToSend: [
        "dateInscription",
        "firstName",
        "lastName",
        "statutCandidat",
        "birthDate",
        "phoneNumber",
        "whatsappNumber",
        "mahzorGiyus",
        "expertConnection",
        "email",
      ],
    },
    columns: NoResponseColumns.columns,
  },
  {
    displayName: "Abandon/Exemption avant le service",
    apiKey: "exemptionOrAbandon",
    icon: FileUser,
    bgColor: "bg-white",
    textColor: "text-black",
    filters: {
      included: {
        currentStatus: [
          "Abandon avant le service",
          "Exemption religieuse",
          "Exemption (autre)",
          "Exemption médicale",
        ],
      },
      excluded: {},
      fieldsToSend: [
        "dateInscription",
        "firstName",
        "lastName",
        "statutCandidat",
        "birthDate",
        "phoneNumber",
        "whatsappNumber",
        "mahzorGiyus",
        "nomPoste",
        "expertConnection",
        "email",
      ],
    },
    columns: AbandonBeforeServiceColumns.columns,
  },
  {
    displayName: "Abandon pendant le service",
    apiKey: "abandonDuringService",
    icon: Shield,
    bgColor: "bg-white",
    textColor: "text-black",
    filters: {
      included: { currentStatus: ["Abandon pendant le service"] },
      excluded: {},
      fieldsToSend: [
        "dateInscription",
        "firstName",
        "lastName",
        "statutCandidat",
        "birthDate",
        "phoneNumber",
        "whatsappNumber",
        "mahzorGiyus",
        "nomPoste",
        "expertConnection",
        "email",
      ],
    },
    columns: AbandonDuringServiceColumns.columns,
  },
  {
    displayName: "R\u00E9sident en Isra\u00EBl sans cadre",
    apiKey: "inIsraelNoFramework",
    icon: MapPin,
    bgColor: "bg-white",
    textColor: "text-black",
    filters: {
      included: { currentStatus: ["En Israel (sans cadre)"] },
      statutCandidat: [["Ne répond pas/Ne sait pas", "Pas de notre ressort"]],
      fieldsToSend: [
        "dateInscription",
        "firstName",
        "lastName",
        "statutCandidat",
        "birthDate",
        "phoneNumber",
        "whatsappNumber",
        "mahzorGiyus",
        "nomPoste",
        "expertConnection",
        "email",
      ],
    },
    columns: ResidentIsraelNoFrameworkColumns.columns,
  },
  {
    displayName: "R\u00E9sident hors d'Isra\u00EBl sans cadre",
    apiKey: "outsideIsrael",
    icon: Globe,
    bgColor: "bg-white",
    textColor: "text-black",
    filters: {
      included: { currentStatus: ["hors d'Israel"] },
      excluded: {
        statutCandidat: [["Ne répond pas/Ne sait pas", "Pas de notre ressort"]],
      },
      fieldsToSend: [
        "dateInscription",
        "firstName",
        "lastName",
        "statutCandidat",
        "birthDate",
        "phoneNumber",
        "whatsappNumber",
        "mahzorGiyus",
        "nomPoste",
        "expertConnection",
        "email",
      ],
    },
    columns: ResidentIsraelNoFrameworkColumns.columns,
  },
  {
    displayName: "Programme Post-BAC",
    apiKey: "postBacProgram",
    icon: GraduationCap,
    bgColor: "bg-white",
    textColor: "text-black",
    filters: {
      included: { currentStatus: ["Programme Post-Bac"] },
      excluded: {},
      fieldsToSend: [
        "dateInscription",
        "statutCandidat",
        "firstName",
        "lastName",
        "programParticipation",
        "programName",
        "schoolYears",
        "mahzorGiyus",
        "expertConnection",
        "email",
      ],
    },
    columns: ProgramAfterBacColumns.columns,
  },
  {
    displayName: "En programme pr\u00E9-Arm\u00E9e",
    apiKey: "preArmyProgram",
    icon: Clock,
    bgColor: "bg-white",
    textColor: "text-black",
    filters: {
      included: { currentStatus: ["Programme Pré-Armée"] },
      excluded: {},
      fieldsToSend: [
        "dateInscription",
        "firstName",
        "lastName",
        "armyDeferralProgram",
        "programNameHebrewArmyDeferral",
        "mahzorGiyus",
        "expertConnection",
        "email",
      ],
    },
    columns: ProgramPreArmyColumns.columns,
  },
  {
    displayName: "En Youd Aleph",
    apiKey: "youdAleph",
    icon: School,
    bgColor: "bg-white",
    textColor: "text-black",
    filters: {
      included: { currentStatus: ["Youd Alef"] },
      excluded: {},
      fieldsToSend: [
        "dateInscription",
        "firstName",
        "lastName",
        "statutCandidat",
        "israeliBacSchool",
        "otherSchoolName",
        "frenchBacSchoolIsrael",
        "mahzorGiyus",
        "expertConnection",
        "email",
      ],
    },
    columns: YoudAlephColumns.columns,
  },
  {
    displayName: "Youd Beth",
    apiKey: "youdBeth",
    icon: School,
    bgColor: "bg-white",
    textColor: "text-black",
    filters: {
      included: { currentStatus: ["Youd Beth"] },
      excluded: {},
      fieldsToSend: [
        "dateInscription",
        "firstName",
        "lastName",
        "statutCandidat",
        "israeliBacSchool",
        "otherSchoolName",
        "frenchBacSchoolIsrael",
        "mahzorGiyus",
        "expertConnection",
        "email",
      ],
    },
    columns: YoudBethColumns.columns,
  },
  {
    displayName: "Olim qui \u00E9tudient",
    apiKey: "toarRishonIsraeli",
    icon: Book,
    bgColor: "bg-white",
    textColor: "text-black",
    filters: {
      included: { currentStatus: ["Toar Rishon/Handsai (Israélien)"] },
      excluded: {},
      fieldsToSend: [
        "dateInscription",
        "firstName",
        "lastName",
        "statutCandidat",
        "universityNameHebrew",
        "diplomaNameHebrew",
        "mahzorGiyus",
        "expertConnection",
        "email",
      ],
    },
    columns: StudyingOlimColumns.columns,
  },
  {
    displayName: "Touristes qui \u00E9tudient",
    apiKey: "toarRishonTourist",
    icon: Book,
    bgColor: "bg-white",
    textColor: "text-black",
    filters: {
      included: { currentStatus: ["Toar Rishon/Handsai (Touriste)"] },
      excluded: {},
      fieldsToSend: [
        "dateInscription",
        "firstName",
        "lastName",
        "statutCandidat",
        "universityNameHebrew",
        "diplomaNameHebrew",
        "mahzorGiyus",
        "expertConnection",
        "email",
      ],
    },
    columns: StudyingTouristColumns.columns,
  },
];
