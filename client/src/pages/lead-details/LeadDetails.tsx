import React, { useEffect, useRef } from "react";
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
import { DiscussionsSection } from "./components/discussions-section";
import { useScrollSpy, useScrollToSection } from "./hooks";
import { tabs } from "./constants/tabs";

const LeadDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: lead,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.leadDetails);

  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const activeTab = useScrollSpy(tabs, sectionRefs);
  const scrollToSection = useScrollToSection(sectionRefs);

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
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 font-[Poppins]
                  ${
                    activeTab === tab.id
                      ? "bg-purple-100 text-purple-700 border border-purple-200 shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }
                `}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className=" mx-auto p-4 space-y-6">
        {lead && (
          <>
            <div
              ref={(el) => (sectionRefs.current["lead-info"] = el)}
              id="lead-info"
              className="scroll-mt-20"
            >
              <LeadInfoSection lead={lead} />
            </div>

            <div
              ref={(el) => (sectionRefs.current["general"] = el)}
              id="general"
              className="scroll-mt-20"
            >
              <GeneralSection lead={lead} />
            </div>

            <div
              ref={(el) => (sectionRefs.current["expert-connection"] = el)}
              id="expert-connection"
              className="scroll-mt-20"
            >
              <ExpertConnectionSection lead={lead} />
            </div>

            <div
              ref={(el) => (sectionRefs.current["judaism-nationality"] = el)}
              id="judaism-nationality"
              className="scroll-mt-20"
            >
              <JudaismNationalitySection lead={lead} />
            </div>

            <div
              ref={(el) => (sectionRefs.current["education"] = el)}
              id="education"
              className="scroll-mt-20"
            >
              <EducationSection lead={lead} />
            </div>

            <div
              ref={(el) => (sectionRefs.current["integration-israel"] = el)}
              id="integration-israel"
              className="scroll-mt-20"
            >
              <IntegrationIsraelSection lead={lead} />
            </div>

            <div
              ref={(el) => (sectionRefs.current["tsahal"] = el)}
              id="tsahal"
              className="scroll-mt-20"
            >
              <TsahalSection lead={lead} />
            </div>

            <div
              ref={(el) => (sectionRefs.current["discussions"] = el)}
              id="discussions"
              className="scroll-mt-20"
            >
              <DiscussionsSection lead={lead} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LeadDetailsPage;
