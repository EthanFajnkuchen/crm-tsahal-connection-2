import { configureStore } from "@reduxjs/toolkit";
import monthlyDataReducer from "./slices/dashboard/monthly-data.slice";
import yearlyDataReducer from "./slices/dashboard/yearly-data.slice";
import lastTenLeadsReducer from "./slices/dashboard/last-ten-leads.slice";
import cardLeadsReducer from "./slices/dashboard/card-leads.slice";
import filteredLeadsReducer from "./slices/dashboard/filtered-card-leads.slice";
import leadsReducer from "./slices/data/all-leads.slice";
import searchLeadsReducer from "./slices/data/search-leads.slice";
import expertCoStatsReducer from "./slices/expert-connection/expert-co-stats.slice";
import expertCoFilteredLeadsReducer from "./slices/expert-connection/filtered-expert-co-card-leads.slice";
import expertCoChartsTotalReducer from "./slices/expert-connection/charts-total.slice";
import expertCoChartsCurrentReducer from "./slices/expert-connection/charts-current.slice";
import expertCoStatsByYearReducer from "./slices/expert-connection/stats-by-year.slice";

export const store = configureStore({
  reducer: {
    monthlyData: monthlyDataReducer,
    yearlyData: yearlyDataReducer,
    lastTenLeads: lastTenLeadsReducer,
    cardLeads: cardLeadsReducer,
    filteredLeads: filteredLeadsReducer,
    allLeads: leadsReducer,
    searchLeads: searchLeadsReducer,
    expertCoStats: expertCoStatsReducer,
    expertCoFilteredLeads: expertCoFilteredLeadsReducer,
    expertCoChartsTotal: expertCoChartsTotalReducer,
    expertCoChartsCurrent: expertCoChartsCurrentReducer,
    exportCoStatsByYear: expertCoStatsByYearReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
