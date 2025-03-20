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
import { expertConnectionColumns } from "@/table-columns/expert-co-lead-columns";

export const EXPERT_CO_CARD_ITEMS = [
  {
    displayName: "EC Total",
    apiKey: "expertCoTotal",
    icon: FileUser,
    bgColor: "bg-white",
    textColor: "text-black",
    filters: {
      included: { expertConnection: ["Oui"] },
      excluded: {},
      fieldsToSend: [
        "dateInscription",
        "firstName",
        "lastName",
        "produitEC1",
        "produitEC2",
        "produitEC3",
        "produitEC4",
        "produitEC5",
        "giyusDate",
      ],
    },
    columns: expertConnectionColumns.columns,
  },
  {
    displayName: "EC Actuel",
    apiKey: "expertCoActuel",
    icon: ClipboardList,
    bgColor: "bg-white",
    textColor: "text-black",
    filters: {
      included: { expertConnection: ["Oui"] },
      excluded: {},
      fieldsToSend: [
        "dateInscription",
        "firstName",
        "lastName",
        "produitEC1",
        "produitEC2",
        "produitEC3",
        "produitEC4",
        "produitEC5",
        "giyusDate",
      ],
    },
    columns: expertConnectionColumns.columns,
  },
];
