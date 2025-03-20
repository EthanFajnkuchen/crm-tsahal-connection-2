import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchExpertCoFilteredLeads,
  ExpertCoFilteredLead,
  ExpertCoLeadFilterDto,
} from "../../adapters/expert-connection/filtered-expert-co-card-leads.adapter";

export const fetchExpertCoFilteredLeadsThunk = createAsyncThunk<
  ExpertCoFilteredLead[],
  ExpertCoLeadFilterDto
>("expertCoFilteredLeads/fetch", async (filters) => {
  const cleanFilters: ExpertCoLeadFilterDto = {
    included: Object.fromEntries(
      Object.entries(filters.included ?? {}).filter(
        ([_, value]) =>
          Array.isArray(value) && value.every((v) => typeof v === "string")
      )
    ) as Record<string, string[]>,

    excluded: Object.fromEntries(
      Object.entries(filters.excluded ?? {}).filter(
        ([_, value]) =>
          Array.isArray(value) && value.every((v) => typeof v === "string")
      )
    ) as Record<string, string[]>,

    fieldsToSend: filters.fieldsToSend ?? [],
  };

  return await fetchExpertCoFilteredLeads(cleanFilters);
});
