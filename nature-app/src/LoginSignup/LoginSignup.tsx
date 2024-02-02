import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  loginUser,
  createAccount,
  resetPassword,
} from "../Components/apiService";
import TaskList from "../Components/Dashboard";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
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

    if (!validateEmail(username)) {
      setErrorMessage(
        "Please enter a valid email address. (example: user@example.com)"
      );
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        username,
        password
      );
      console.log(userCredential.user);

      setCurrentTaskIndex(0);
      navigate("/dashboard");
      setErrorMessage("");
    } catch (error: any) {
      console.log("Error logging in:", error);
      let errorMessage = "Failed to login";
      if (error.code) {
        switch (error.code) {
          case "auth/invalid-email":
            errorMessage =
              "Invalid email format. Please enter a correct email.";
            break;
          case "auth/user-disabled":
            errorMessage = "User account has been disabled.";
            break;
          case "auth/user-not-found":
            errorMessage = "User not found. Please sign up.";
            break;
          case "auth/wrong-password":
            errorMessage = "Incorrect password. Please try again.";
            break;
          case "auth/invalid-credential":
            errorMessage =
              "Invalid credential. Please check your login details.";
            break;
          default:
            errorMessage = "Failed to log in. Please try again.";
            break;
        }
      } else {
        errorMessage = error.message || errorMessage;
      }
      setErrorMessage(errorMessage);
    }
  };

  function validateEmail(email: string) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setErrorMessage(""); // Clear any existing error messages

    try {
      if (showResetPasswordForm) {
        // If it's the reset password form, handle the reset password logic
        await handleResetPassword();
      } else if (showCreateAccountForm) {
        // If it's the create account form, handle the account creation logic
        await handleCreateAccount2();
      } else {
        // If it's the login form, handle the login logic
        await handleLogin(); // This is essentially the simpler version you provided
      }
    } catch (error) {
      // Log the error and set an error message to be displayed to the user
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
                type="email"
                id="username"
                placeholder="Email"
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
                type="email"
                id="username"
                placeholder="Email"
                autoComplete="off"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white opacity-50 w-48 h-10 my-2.5 rounded-full p-2 text-black"
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
        {errorMessage && <div>{errorMessage}</div>}
      </div>
    </div>
  );
};

export default LoginSignup;
