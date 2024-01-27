// Import necessary libraries and components
import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  loginUser,
  resetPassword,
  createAccount,
  getTasks,
} from "../Components/apiService";
import "../index.css";
import "../App.css";
import Image from "../image/robert-lukeman-_RBcxo9AU-U-unsplash 2.png";

const LoginSignup = () => {
  // State hooks
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);
  const [showCreateAccountForm, setShowCreateAccountForm] = useState(false);

  const navigate = useNavigate(); // Define navigate function here

  // Callbacks for UI logic
  const handleForgotPassword = useCallback(() => {
    setShowLoginForm(false);
    setShowResetPasswordForm(true);
    setShowCreateAccountForm(false);
    clearForm();
  }, []);

  const handleCreateAccount = useCallback(() => {
    setShowLoginForm(false);
    setShowResetPasswordForm(false);
    setShowCreateAccountForm(true);
    clearForm();
  }, []);

  const clearForm = () => {
    setUsername("");
    setPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrorMessage("");
  };

  const handleBackToLogin = useCallback(() => {
    setShowLoginForm(true);
    setShowResetPasswordForm(false);
    setShowCreateAccountForm(false);
    clearForm();
  }, []);

  // Function to handle password reset
  const handleResetPassword = async () => {
    if (!username || !newPassword || newPassword !== confirmPassword) {
      setErrorMessage("Please check your inputs");
      return;
    }

    try {
      const message = await resetPassword(username, newPassword);
      alert(message);
      handleBackToLogin();
    } catch (error) {
      setErrorMessage("Failed to reset password");
      console.error("Error resetting password:", error);
    }
  };

  // Function to handle new account creation
  const handleCreateAccount2 = async () => {
    if (!username || !password) {
      setErrorMessage("Username and password are required");
      return;
    }

    try {
      const message = await createAccount(username, password);
      alert(message);
      handleBackToLogin();
    } catch (error) {
      setErrorMessage("Failed to create account");
      console.error("Error creating account:", error);
    }
  };

  // Function to handle user login
  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMessage("Username and password are required");
      return;
    }

    try {
      const data = await loginUser(username, password);
      console.log("Login data:", data);

      if (data) {
        // Successful login
        localStorage.setItem("token", data.token);

        try {
          const tasks = await getTasks();
          console.log("Tasks:", tasks);

          if (tasks.length > 0) {
            const navigate = useNavigate();
            // Use navigate from react-router-dom v6 for navigation
            navigate("/dashboard");
          } else {
            setErrorMessage("No tasks available");
          }
        } catch (taskError) {
          console.error("Error fetching tasks:", taskError);
          setErrorMessage("Failed to fetch tasks");
        }
      } else {
        setErrorMessage("Login failed: No data received");
      }
    } catch (loginError) {
      setErrorMessage("Failed to login");
      console.error("Error logging in:", loginError);
    }
  };

  // Form submission handler
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setErrorMessage("");

    if (showResetPasswordForm) {
      await handleResetPassword();
    } else if (showCreateAccountForm) {
      await handleCreateAccount2();
    } else {
      await handleLogin();
    }
  };

  // JSX for the component
  return (
    <div>
      <div className="flex justify-center items-center h-screen">
        <img src={Image} alt="Background" className="w-80 h-142" />
        <form
          onSubmit={handleSubmit}
          className=" absolute top-1/2 left-1/2 w-64 h-110 bg-green-500 opacity-85 transform -translate-x-1/2 -translate-y-1/2"
        >
          {/* Login Form */}
          {showLoginForm && (
            <>
              <h1 className="font-cursive text-2xl text-black mb-4">
                Login to your account
              </h1>
              <input
                type="text"
                id="username"
                placeholder="Username"
                autoComplete="off"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white opacity-50 w-48 h-10 my-2.5 rounded-full p-2 text-black"
              />
              <input
                type="password"
                placeholder="Password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white opacity-50 w-48 h-10 my-2.5 rounded-full p-2"
              />
              <button
                type="submit"
                className="btn bg-white opacity-50 w-48 h-10 my-2.5 rounded-full"
                onClick={handleLogin}
              >
                Login
              </button>
              <div className="flex justify-between items-center mb-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600"
                    id="check"
                  />
                  <span className="ml-2 text-sm">Remember</span>
                </label>
                <button
                  type="button"
                  className="forgot bg-white opacity-50 w-24 h-10 text-sm rounded-full"
                  onClick={handleForgotPassword}
                >
                  Forgot Password?
                </button>
              </div>
              <button
                type="button"
                className="forgot bg-white opacity-50 w-full h-10 text-sm mb-2 rounded-full"
                onClick={handleCreateAccount}
              >
                Create an Account
              </button>
            </>
          )}

          {/* Reset Password Form */}
          {showResetPasswordForm && (
            <>
              <h1 className="text-2xl font-bold mb-4">Reset Your Password</h1>
              <input
                type="password"
                placeholder="New Password"
                id="password-new"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="rounded-full bg-white opacity-50 w-full h-10 mb-2 p-2"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                id="password-confirm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="rounded-full bg-white opacity-50 w-full h-10 mb-2 p-2"
              />
              <button
                type="submit"
                className="rounded-full bg-blue-500 w-full h-10 mb-2 text-white font-bold"
              >
                Reset Password
              </button>
              <button
                type="button"
                className="forgot bg-white opacity-50 w-full h-10 text-sm rounded-full"
                onClick={handleBackToLogin}
              >
                Back to Login
              </button>
            </>
          )}

          {/* Create Account Form */}
          {showCreateAccountForm && (
            <>
              <h1 className="font-[KaushanScript] text-2xl text-black">
                Create an Account
              </h1>
              <input
                type="text"
                placeholder="Username"
                id="new-username"
                className="bg-white opacity-50 w-48 h-10 my-2.5 rounded-full p-2"
                autoComplete="off"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                id="new-password"
                className="bg-white opacity-50 w-48 h-10 my-2.5 rounded-full p-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="submit"
                className="btn bg-white opacity-50 w-48 h-10 my-2.5 rounded-full"
              >
                Create Account
              </button>
              <button
                type="button"
                className="forgot bg-white opacity-50 w-full h-10 text-sm mb-2 rounded-full"
                onClick={handleBackToLogin}
              >
                Back to Login
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginSignup;
