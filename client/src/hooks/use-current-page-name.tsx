import { useLocation } from "react-router-dom";
import { SIDEBAR_ITEMS } from "@/i18n/sidebar-items";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

const useCurrentPageName = (): string => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { data: lead } = useSelector((state: RootState) => state.leadDetails);

  const currentPage = SIDEBAR_ITEMS.find((item) => item.link === currentPath);

  if (currentPath.includes("/lead-details/") && lead) {
    return `${lead.firstName} ${lead.lastName}`;
  }

  return currentPage ? currentPage.displayName : "Page inconnue";
};

export default useCurrentPageName;
