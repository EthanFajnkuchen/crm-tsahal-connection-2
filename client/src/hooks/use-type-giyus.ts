import { useMemo } from "react";

export const useTypeGiyus = (
  giyusDate: string | undefined,
  mahalPath: string | undefined,
  currentStatus: string | undefined,
  serviceType: string | undefined
): string => {
  console.log({ giyusDate });
  console.log({ mahalPath });
  console.log({ currentStatus });
  console.log({ serviceType });
  return useMemo(() => {
    let typeGiyus = "";
    console.log("enter");

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
