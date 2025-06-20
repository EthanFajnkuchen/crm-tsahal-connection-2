import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeadDetailsThunk } from "../../store/thunks/lead-details/lead-details.thunk";
import { RootState, AppDispatch } from "../../store/store";
import { GeneralSection } from "./components/general-section";
import { ExpertConnectionSection } from "./components/expert-connection-section";
import { JudaismNationalitySection } from "./components/judaism-nationality-section";
import { EducationSection } from "./components/education-section";
import { IntegrationIsraelSection } from "./components/integration-israel-section";
import { TsahalSection } from "./components/tsahal-section";
import { LeadInfoSection } from "./components/lead-info-section";

const LeadDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: lead,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.leadDetails);

  useEffect(() => {
    if (id) {
      dispatch(fetchLeadDetailsThunk(id));
    }
  }, [dispatch, id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  if (!lead) {
    return <div className="text-center p-4">No lead found</div>;
  }

  return (
    <div className="p-4 space-y-4">
      {lead && (
        <>
          <LeadInfoSection lead={lead} />
          <GeneralSection lead={lead} />
          <ExpertConnectionSection lead={lead} />
          <JudaismNationalitySection lead={lead} />
          <EducationSection lead={lead} />
          <IntegrationIsraelSection lead={lead} />
          <TsahalSection lead={lead} />
        </>
      )}
    </div>
  );
};

export default LeadDetailsPage;
