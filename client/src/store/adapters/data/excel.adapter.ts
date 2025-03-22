import { API_ROUTES } from "@/constants/api-routes";

const M2M_TOKEN = import.meta.env.VITE_API_M2M_TOKEN;

export const downloadLeads = async (): Promise<Blob> => {
  const response = await fetch(API_ROUTES.DOWNLOAD_LEADS, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${M2M_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to download leads");
  }

  return await response.blob();
};
