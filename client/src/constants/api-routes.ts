const BACKEND_BASE_URL = import.meta.env.VITE_API_BACKEND_BASE_URL;
export const API_ROUTES = {
  DASHBOARD_LAST_TEN_LEADS: `${BACKEND_BASE_URL}/last_10_leads`,
  DASHBOARD_CHART_MONTHLY: `${BACKEND_BASE_URL}/leads_per_month`,
  DASHBOARD_CHART_YEARLY: `${BACKEND_BASE_URL}/subscriptions_per_year`,
};
