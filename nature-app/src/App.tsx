import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ResetPassword from "./Components/ResetPassword";
import LoginSignup from "./LoginSignup/LoginSignup";
import Dashboard from "./Components/Dashboard";

import "./index.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<LoginSignup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
