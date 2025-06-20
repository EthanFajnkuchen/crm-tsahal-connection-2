import { useMemo } from "react";
import { ShieldCheck } from "lucide-react";

interface ExpertConnectionData {
  expertConnection?: string;
  produitEC1?: string;
  produitEC2?: string;
  produitEC3?: string;
  produitEC4?: string;
  produitEC5?: string;
}

export const useExpertCoBadge = (data: ExpertConnectionData) => {
  return useMemo(() => {
    if (data.expertConnection !== "Oui") {
      return null;
    }

    const produits = [
      data.produitEC1,
      data.produitEC2,
      data.produitEC3,
      data.produitEC4,
      data.produitEC5,
    ].filter(Boolean);

    const hasSuivi = produits.some((produit) =>
      produit?.toLowerCase().includes("suivi")
    );

    if (hasSuivi) {
      return <ShieldCheck className="h-7 w-7 text-white" fill="#3b82f6" />;
    } else if (produits.length > 0) {
      return <ShieldCheck className="h-7 w-7 text-white" fill="#f97316" />;
    }

    return null;
  }, [
    data.expertConnection,
    data.produitEC1,
    data.produitEC2,
    data.produitEC3,
    data.produitEC4,
    data.produitEC5,
  ]);
};
