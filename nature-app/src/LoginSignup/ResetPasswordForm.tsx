import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromURL = queryParams.get("token");
    if (tokenFromURL) {
      setToken(tokenFromURL);
      verifyToken(tokenFromURL);
    } else {
      setMessage("No reset token provided.");
    }
  }, [location]);

  const verifyToken = async (token: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post("/verify-token", { token });
      setEmail(response.data.email);
      setMessage("");
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setMessage("Invalid token. Please try again.");
    }
  };

  const validatePassword = () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validatePassword()) {
      return;
    }
    setIsLoading(true);
    try {
      await axios.post("/reset-password", { token, newPassword });
      setMessage("Password has been reset successfully.");
      setTimeout(() => navigate("/login"), 3000); // Redirect to login after 3 seconds
    } catch (error) {
      console.error(error);
      setMessage("Error resetting password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h1>Reset Password</h1>
        {message && (
          <div className={isLoading ? "message loading" : "message"}>
            {message}
          </div>
        )}
        <input
          id="email"
          type="email"
          autoComplete="off"
          placeholder="Enter your email"
          value={email}
          disabled
        />
        <input
          id="newPassword"
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          id="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {passwordError && <div className="error-message">{passwordError}</div>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
