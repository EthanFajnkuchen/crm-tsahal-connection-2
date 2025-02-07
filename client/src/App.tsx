import "./App.css";
import DashboardCardsSection from "./components/app-components/dashboard-card-section/dashboard-card-section";
import Header from "./components/app-components/header/Header";
import { AppSidebar } from "./components/app-components/sidebar/app-sidebar";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="flex">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <Header />
          <DashboardCardsSection />
        </div>
      </div>
    </Router>
  );
}

export default App;
