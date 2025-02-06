import "./App.css";
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
          <div className="p-4"></div>
        </div>
      </div>
    </Router>
  );
}

export default App;
