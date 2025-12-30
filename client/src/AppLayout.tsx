import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/app-components/sidebar/app-sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { HeaderMobile } from "@/components/app-components/header-mobile/header-mobile";
import Header from "@/components/app-components/header-desktop/header-desktop";

const AppLayout = () => {
  const isMobile = useIsMobile();

  return (
    <div className="md:flex h-screen overflow-hidden">
      {!isMobile && <AppSidebar />}
      {isMobile && <HeaderMobile />}
      <div className="flex flex-col flex-1 bg-[#f3eefb] h-screen overflow-hidden">
        {!isMobile && <Header />}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
