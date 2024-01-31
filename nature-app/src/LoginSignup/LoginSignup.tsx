import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  loginUser,
  createAccount,
  resetPassword,
} from "../Components/apiService";
import TaskList from "../Components/Dashboard";
import db from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import "../index.css";
import "../App.css";

const LoginSignup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);
  const [showCreateAccountForm, setShowCreateAccountForm] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

  const navigate = useNavigate();

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

  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMessage("Username and password are required");
      return;
    }

    try {
      const loginData = await loginUser(username, password);
      const userCollection = collection(db, "users");
      await addDoc(userCollection, { username });

      // Set the first task as the current task
      setCurrentTaskIndex(0); // This sets the index to the first task
      // Assuming TaskList is imported and available here

      navigate("/dashboard"); // Navigate to the dashboard
    } catch (error) {
      setErrorMessage("Failed to login");
      console.error("Error logging in:", error);
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setErrorMessage("");

    try {
      if (showResetPasswordForm) {
        await handleResetPassword();
      } else if (showCreateAccountForm) {
        await handleCreateAccount2();
      } else {
        await handleLogin();
      }
    } catch (error) {
      console.error("An error occurred while submitting the form:", error);
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div>
      <div className="flex justify-center items-center h-screen">
        <form
          onSubmit={handleSubmit}
          className="absolute top-1/2 left-1/2 w-64 h-110 bg-green-500 opacity-85 transform -translate-x-1/2 -translate-y-1/2"
        >
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
function setErrorMessage(arg0: string) {
  throw new Error("Function not implemented.");
}
