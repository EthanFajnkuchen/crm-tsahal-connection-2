import React from "react";
import { useLocation } from "react-router-dom";
import { SIDEBAR_ITEMS } from "@/i18n/sidebar-items";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { useExpertCoBadge } from "./use-expert-co-badge";

const useCurrentPageName = (): string | React.ReactNode => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { data: lead } = useSelector((state: RootState) => state.leadDetails);
  const { activities } = useSelector((state: RootState) => state.activity);

  const expertCoBadge = useExpertCoBadge({
    expertConnection: lead?.expertConnection,
    produitEC1: lead?.produitEC1,
    produitEC2: lead?.produitEC2,
    produitEC3: lead?.produitEC3,
    produitEC4: lead?.produitEC4,
    produitEC5: lead?.produitEC5,
  });

  const currentPage = SIDEBAR_ITEMS.find((item) => item.link === currentPath);

  if (currentPath.includes("/lead-details/") && lead) {
    return (
      <div className="flex items-center gap-2">
        <span>{`${lead.firstName} ${lead.lastName}`}</span>
        {expertCoBadge}
      </div>
    );
  }

  if (currentPath.includes("/activites/")) {
    // Try to get activity name from navigation state first
    const activityName = location.state?.activityName;
    if (activityName) {
      return activityName;
    }

    // Fallback: try to find in activities store
    const activityIdMatch = currentPath.match(/\/activites\/(\d+)/);
    if (activityIdMatch) {
      const activityId = parseInt(activityIdMatch[1], 10);
      const currentActivity = activities.find(
        (activity) => activity.id === activityId
      );
      if (currentActivity) {
        return currentActivity.name;
      }
    }
    return "Détails de l'activité";
  }

  return currentPage ? currentPage.displayName : "Page inconnue";
};

export default useCurrentPageName;
