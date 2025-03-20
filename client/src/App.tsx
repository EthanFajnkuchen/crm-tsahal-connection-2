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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<AppLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="data" element={<Data />} />
          <Route path="expert-connection" element={<ExpertConnection />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
