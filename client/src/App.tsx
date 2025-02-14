import "./App.css";
import { AppSidebar } from "@/components/app-components/sidebar/app-sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { HeaderMobile } from "@/components/app-components/header-mobile/header-mobile";
import Header from "@/components/app-components/header-desktop/header-desktop";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import Data from "./pages/data/Data";

function App() {
  const isMobile = useIsMobile();
  return (
    <Router>
      <div className="md:flex">
        {!isMobile && <AppSidebar />}
        {isMobile && <HeaderMobile />}
        <div className="flex flex-col flex-1">
          {!isMobile && <Header />}

          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/data" element={<Data />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
