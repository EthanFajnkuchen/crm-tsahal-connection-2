import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "./slices/dashboard.slice";
import monthlyDataReducer from "./slices/dashboard/monthly-data.slice";
import yearlyDataReducer from "./slices/dashboard/yearly-data.slice";
import lastTenLeadsReducer from "./slices/dashboard/last-ten-leads.slice";
import cardLeadsReducer from "./slices/dashboard/card-leads.slice";

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    monthlyData: monthlyDataReducer,
    yearlyData: yearlyDataReducer,
    lastTenLeads: lastTenLeadsReducer,
    cardLeads: cardLeadsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
