export const badgeStyles: Record<string, string> = {
  "À traiter": "bg-[#C6E2D8] text-[#0F5132]",
  "En cours de traitement": "bg-[#FFE4B5] text-[#D2691E]",
  "Dossier traité": "bg-[#FADADD] text-[#800020]",
  "Ne répond pas/Ne sait pas": "bg-[#9bc9f4] text-[#0e5285]",
  "Pas de notre ressort": "bg-[#D6D8DB] text-[#495057]",
};

export const useBadgeStyle = (status: keyof typeof badgeStyles): string => {
  return badgeStyles[status] || "bg-gray-300 text-gray-700";
};
