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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<AppLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="data" element={<Data />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
