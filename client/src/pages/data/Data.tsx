import React from "react";
import { LeadTable } from "./lead-table/lead-table";
import ProtectedComponent from "@/components/app-components/protected-component/protected-component";

const Data: React.FC = () => {
  return (
    <div className="min-h-[90vh]">
      <ProtectedComponent showUnauthorizedMessage={true}>
        <LeadTable />
      </ProtectedComponent>
    </div>
  );
};

export default Data;
