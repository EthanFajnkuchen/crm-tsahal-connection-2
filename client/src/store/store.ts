import { configureStore } from "@reduxjs/toolkit";
import monthlyDataReducer from "./slices/dashboard/monthly-data.slice";
import yearlyDataReducer from "./slices/dashboard/yearly-data.slice";
import lastTenLeadsReducer from "./slices/dashboard/last-ten-leads.slice";
import cardLeadsReducer from "./slices/dashboard/card-leads.slice";
import filteredLeadsReducer from "./slices/dashboard/filtered-card-leads.slice";
import leadsReducer from "./slices/data/all-leads.slice";

export const store = configureStore({
  reducer: {
    monthlyData: monthlyDataReducer,
    yearlyData: yearlyDataReducer,
    lastTenLeads: lastTenLeadsReducer,
    cardLeads: cardLeadsReducer,
    filteredLeads: filteredLeadsReducer,
    allLeads: leadsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
