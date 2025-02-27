import React from "react";
import Section from "@/components/app-components/section/section";
import { LastTenLeadTable } from "@/components/app-components/last-ten-leads-table/last-ten-leads-table";

const LastTenLeadSection: React.FC = () => {
  return (
    <Section title={"Derniers leads"}>
      <div className="">
        <LastTenLeadTable />
      </div>
    </Section>
  );
};

export default LastTenLeadSection;
