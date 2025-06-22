export interface Tab {
  id: string;
  label: string;
  icon: string;
}

export const tabs: Tab[] = [
  { id: "lead-info", label: "Infos Lead", icon: "👤" },
  { id: "general", label: "Général", icon: "📋" },
  { id: "expert-connection", label: "Expert Connection", icon: "🤝" },
  { id: "judaism-nationality", label: "Judaïsme & Nationalité", icon: "✡️" },
  { id: "education", label: "Éducation", icon: "🎓" },
  { id: "integration-israel", label: "Intégration Israël", icon: "🏠" },
  { id: "tsahal", label: "Tsahal", icon: "⚔️" },
];
