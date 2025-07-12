import { useMemo } from "react";

export const useTypeGiyus = (
  giyusDate: string | undefined,
  mahalPath: string | undefined,
  currentStatus: string | undefined,
  serviceType: string | undefined
): string => {

  return useMemo(() => {
    let typeGiyus = "";

    if (
      giyusDate &&
      giyusDate !== "" &&
      (mahalPath === "Nahal" || mahalPath === "Haredi") &&
      currentStatus !== "Abandon avant le service"
    ) {
      typeGiyus = "Mahal Nahal / Mahal Haredi";
    }

    if (
      giyusDate &&
      giyusDate !== "" &&
      (serviceType === "Service complet" ||
        serviceType === "Études" ||
        serviceType === "Garin Tzabar" ||
        serviceType === "Haredi" ||
        serviceType === "Volontaires" ||
        mahalPath === "Hesder") &&
      currentStatus !== "Abandon avant le service"
    ) {
      typeGiyus = "Olim/Hesder";
    }

    return typeGiyus;
  }, [giyusDate, mahalPath, currentStatus, serviceType]);
};
