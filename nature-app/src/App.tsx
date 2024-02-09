import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginSignup from "./LoginSignup/LoginSignup";
import Dashboard from "./Components/Dashboard";

import "./index.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
