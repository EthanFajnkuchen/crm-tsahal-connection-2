const current_status = [
  {
    value: "Youd Alef",
    displayName:
      "En classe de première/youd alef en Israël (école israélienne ou école française)",
  },
  {
    value: "Youd Beth",
    displayName:
      "En classe de terminale/youd beth en Israël (école israélienne ou école française)",
  },
  {
    value: "Programme Post-Bac",
    displayName: "En programme d'intégration postbac en Israël",
  },
  {
    value: "Programme Pré-Armée",
    displayName:
      "En programme pré-armée israélien (Yeshivat hesder, Mechina Kdam Tsvaïit, Yeshiva, chnat chirout)",
  },
  {
    value: "Toar Rishon/Handsai (Israélien)",
    displayName:
      "En études supérieures/études technologiques en Israël en tant qu'israélien",
  },
  {
    value: "Toar Rishon/Handsai (Touriste)",
    displayName:
      "En études supérieures/études technologiques en Israël en tant que touriste",
  },
  {
    value: "En Israel (sans cadre)",
    displayName: "Résident en Israël dans aucun des cadres cités plus haut",
  },
  {
    value: "Hors d'Israel",
    displayName: "Résident hors d'Israël",
  },
];

const internal_status = [
  {
    value: "Un soldat - unité",
    displayName: "Un soldat - unité",
  },
  {
    value: "Un soldat - sans unité",
    displayName: "Un soldat - sans unité",
  },
  {
    value: "Un soldat - en formation",
    displayName: "Un soldat - en formation",
  },
  {
    value: "Abandon avant le service",
    displayName: "Abandon avant le service",
  },
  {
    value: "Abandon pendant le service",
    displayName: "Abandon pendant le service",
  },
  {
    value: "Exemption médicale",
    displayName: "Exemption médicale",
  },
  {
    value: "Exemption religieuse",
    displayName: "Exemption religieuse",
  },
  {
    value: "Exemption (autre)",
    displayName: "Exemption (autre)",
  },
];

export const CURRENT_STATUS = {
  current_status,
  internal_status,
  all_status: [...current_status, ...internal_status],
};
