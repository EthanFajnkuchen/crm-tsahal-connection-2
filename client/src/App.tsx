import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import Data from "./pages/data/Data";
import AppLayout from "./AppLayout";
import ExpertConnection from "./pages/expert-connection/ExpertConnection";
import MahzorGiyus from "./pages/mahzor-giyus/MahzorGiyus";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import AuthTokenRouteGuard from "./AuthTokenRouteGuard";
import Logo from "@/assets/pictures/Logo Tsahal Conection.png";
import "./App.css";
import FormsRapports from "./pages/forms-rapports/Form-Rapports";
import LeadDetails from "./pages/lead-details/LeadDetails";
import TafkidimPage from "./pages/tafkidim/TafkidimPage";
const ProtectedAppLayout = withAuthenticationRequired(AppLayout, {
  onRedirecting: () => (
    <div className="flex items-center justify-center h-screen bg-white">
      <img
        src={Logo}
        alt="Logo Tsahal Connection"
        className="w-32 h-32 loading-logo"
      />
    </div>
  ),
});

function App() {
  return (
    <Router>
      <AuthTokenRouteGuard />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<ProtectedAppLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="data" element={<Data />} />
          <Route path="expert-connection" element={<ExpertConnection />} />
          <Route path="mahzor-giyus" element={<MahzorGiyus />} />
          <Route path="forms-rapports" element={<FormsRapports />} />
          <Route path="lead-details/:id" element={<LeadDetails />} />
          <Route path="tafkidim" element={<TafkidimPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
