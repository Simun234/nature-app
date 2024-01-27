import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginSignup from "./LoginSignup/LoginSignup";
import Dashboard from "./Components/Dashboard";
import ResetPasswordForm from "./LoginSignup/ResetPasswordForm";
import "./index.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />
      </Routes>
    </Router>
  );
};

export default App;
