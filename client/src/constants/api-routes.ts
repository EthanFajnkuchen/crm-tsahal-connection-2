const BACKEND_BASE_URL = import.meta.env.VITE_API_BACKEND_BASE_URL;
export const API_ROUTES = {
  DASHBOARD_LAST_TEN_LEADS: `${BACKEND_BASE_URL}/api/leads?limit=10`,
  DASHBOARD_CHART_MONTHLY: `${BACKEND_BASE_URL}/api/leads/per-month`,
  DASHBOARD_CHART_YEARLY: `${BACKEND_BASE_URL}/api/leads/per-year`,
};
