import "./App.css";
import DashboardCardsSection from "@/components/app-components/dashboard-card-section/dashboard-card-section";
import LastTenLeadSection from "@/components/app-components/last-ten-leads-section/last-ten-leads-section";
import { AppSidebar } from "@/components/app-components/sidebar/app-sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { HeaderMobile } from "@/components/app-components/header-mobile/header-mobile";
import Header from "@/components/app-components/header/header";

import { BrowserRouter as Router } from "react-router-dom";

function App() {
  const isMobile = useIsMobile();
  return (
    <Router>
      <div className="md:flex">
        {!isMobile && <AppSidebar />}
        {isMobile && <HeaderMobile />}
        <div className="flex flex-col flex-1">
          {!isMobile && <Header />}
          <DashboardCardsSection />
          <LastTenLeadSection />
        </div>
      </div>
    </Router>
  );
}

export default App;
