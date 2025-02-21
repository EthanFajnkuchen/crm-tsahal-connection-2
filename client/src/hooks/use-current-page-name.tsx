import { useLocation } from "react-router-dom";
import { SIDEBAR_ITEMS } from "@/i18n/sidebar-items";

const useCurrentPageName = (): string => {
  const location = useLocation();
  const currentPath = location.pathname;

  const currentPage = SIDEBAR_ITEMS.find((item) => item.link === currentPath);

  return currentPage ? currentPage.displayName : "Page inconnue";
};

export default useCurrentPageName;
