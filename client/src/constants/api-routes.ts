const BACKEND_BASE_URL = import.meta.env.VITE_API_BACKEND_BASE_URL;
export const API_ROUTES = {
  DASHBOARD_CARD_LEADS: `${BACKEND_BASE_URL}/api/leads/statistics`,
  DASHBOARD_LAST_TEN_LEADS: `${BACKEND_BASE_URL}/api/leads?limit=10`,
  DASHBOARD_CHART_MONTHLY: `${BACKEND_BASE_URL}/api/leads/per-month`,
  DASHBOARD_CHART_YEARLY: `${BACKEND_BASE_URL}/api/leads/per-year`,
  FILTERED_LEADS: `${BACKEND_BASE_URL}/api/leads/filters`,
  DATA_TABLE_LEADS: `${BACKEND_BASE_URL}/api/leads/`,
  DOWNLOAD_LEADS: `${BACKEND_BASE_URL}/api/leads/download`,
  EXPERT_CO_STATS: `${BACKEND_BASE_URL}/api/leads/expert-co-statistics`,
  EXPERT_CO_CHARTS: `${BACKEND_BASE_URL}/api/leads/expert-co-charts`,
  EXPERT_CO_STATS_BY_YEAR: `${BACKEND_BASE_URL}/api/leads/expert-co-stats-by-year`,
  MAHZOR_GIYUS: `${BACKEND_BASE_URL}/api/leads/mahzor-giyus-counts`,
};
