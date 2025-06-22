import { useMemo } from "react";

export const useMahzorGiyus = (giyusDate: string | undefined): string => {
  return useMemo(() => {
    let mahzorGiyus = "";

    if (!giyusDate) {
      return mahzorGiyus;
    }

    const [year, month] = giyusDate.split("-").map(Number);

    if (month >= 2 && month <= 5) {
      mahzorGiyus = `Mars ${year}`;
    } else if (month >= 6 && month <= 9) {
      mahzorGiyus = `Aout ${year}`;
    } else if (month === 1) {
      mahzorGiyus = `Novembre ${year - 1}`;
    } else {
      mahzorGiyus = `Novembre ${year}`;
    }

    return mahzorGiyus;
  }, [giyusDate]);
};
