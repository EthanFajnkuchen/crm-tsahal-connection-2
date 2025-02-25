import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchFilteredLeads,
  FilteredLead,
  LeadFilterDto,
} from "../../adapters/dashboard/filtered-card-leads.adapter";

export const fetchFilteredLeadsThunk = createAsyncThunk<
  FilteredLead[],
  LeadFilterDto
>("filteredLeads/fetchFilteredLeads", async (filters) => {
  const cleanFilters: LeadFilterDto = {
    included: Object.fromEntries(
      Object.entries(filters.included ?? {}).filter(
        ([_, value]) =>
          Array.isArray(value) && value.every((v) => typeof v === "string")
      )
    ) as Record<string, string[]>, // ✅ Force le bon type

    excluded: Object.fromEntries(
      Object.entries(filters.excluded ?? {}).filter(
        ([_, value]) =>
          Array.isArray(value) && value.every((v) => typeof v === "string")
      )
    ) as Record<string, string[]>, // ✅ Force le bon type

    fieldsToSend: filters.fieldsToSend ?? [],
  };

  return await fetchFilteredLeads(cleanFilters);
});
