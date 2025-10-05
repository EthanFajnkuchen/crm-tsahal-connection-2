import React from "react";
import { ActivityTable } from "./activity-table/activity-table";
import ProtectedComponent from "@/components/app-components/protected-component/protected-component";

const Activities: React.FC = () => {
  return (
    <div className="min-h-[90vh]">
      <ActivityTable />
    </div>
  );
};

export default Activities;
