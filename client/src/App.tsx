import "./App.css";
import DashboardCardsSection from "./components/app-components/dashboard-card-section/dashboard-card-section";
import Header from "./components/app-components/header/Header";
import LastTenLeadSection from "./components/app-components/last-ten-leads-section/last-ten-leads-section";
import { AppSidebar } from "./components/app-components/sidebar/app-sidebar";
import { BrowserRouter as Router } from "react-router-dom";
import { useIsMobile } from "./hooks/use-mobile";

function App() {
  const isMobile = useIsMobile();
  return (
    <Router>
      <div className="flex">
        {!isMobile && <AppSidebar />}
        <div className="flex flex-col flex-1">
          <Header />
          <DashboardCardsSection />
          <LastTenLeadSection />
        </div>
      </div>
    </Router>
  );
}

export default App;
