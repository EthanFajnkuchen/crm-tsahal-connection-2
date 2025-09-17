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
import MahzorGiyusReducer from "./slices/mahzor-giyus/mahzor-giyus.slice";
import ExcelReducer from "./slices/data/excel.slice";
import leadDetailsReducer from "./slices/lead-details/lead-details.slice";
import discussionsReducer from "./slices/discussions/discussions.slice";
import tafkidimReducer from "./slices/tafkidim/tafkidim.slice";
import changeRequestReducer from "./slices/change-request/change-request.slice";
import bulkTsavRishonReducer from "./slices/bulk-operations/bulk-tsav-rishon.slice";
import bulkGiyusReducer from "./slices/bulk-operations/bulk-giyus.slice";
import activityReducer from "./slices/activity/activity.slice";

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
    mahzorGiyus: MahzorGiyusReducer,
    downloadExcel: ExcelReducer,
    leadDetails: leadDetailsReducer,
    discussions: discussionsReducer,
    tafkidim: tafkidimReducer,
    changeRequest: changeRequestReducer,
    bulkTsavRishon: bulkTsavRishonReducer,
    bulkGiyus: bulkGiyusReducer,
    activity: activityReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
