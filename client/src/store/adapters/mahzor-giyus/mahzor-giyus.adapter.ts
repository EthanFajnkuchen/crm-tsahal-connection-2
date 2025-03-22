import { API_ROUTES } from "@/constants/api-routes";

const M2M_TOKEN = import.meta.env.VITE_API_M2M_TOKEN;

export interface MahzorGiyusLead {
  firstName: string;
  lastName: string;
  expertConnection: string;
  gender: string;
  statutCandidat: string;
  giyusDate: string;
  dateFinService: string;
  nomPoste: string;
  email: string;
}

export interface MahzorGiyusPeriodData {
  count: number;
  leads: MahzorGiyusLead[];
}

export type MahzorGiyusCounts = Record<
  string,
  Record<string, MahzorGiyusPeriodData>
>;

export const fetchMahzorGiyusCounts = async (): Promise<MahzorGiyusCounts> => {
  const response = await fetch(API_ROUTES.MAHZOR_GIYUS, {
    headers: {
      Authorization: `Bearer ${M2M_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Mahzor Giyus counts");
  }

  return await response.json();
};
