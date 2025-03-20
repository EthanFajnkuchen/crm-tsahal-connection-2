import { FileUser, ClipboardList } from "lucide-react";

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
