import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import { auth } from "../firebase";
import "../index.css";
import "../App.css";

const LoginSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();
  const db = getFirestore();

  const clearForm = () => {
    setEmail("");
    setPassword("");
    setErrorMessage("");
  };

  const handleCreateAccountView = () => {
    setShowLoginForm(false);
    clearForm();
  };

  const handleBackToLogin = () => {
    setShowLoginForm(true);
    clearForm();
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleCreateAccount = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMessage("Email and password are required.");
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage(
        "Please enter a valid email address. (example: user@example.com)"
      );
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Account created:", userCredential.user);

      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: email,
      });

      setSuccessMessage("Account created successfully! Please login.");
      setShowLoginForm(true);
      setShowCreateAccountForm(false);
      clearForm();
    } catch (error: any) {
      console.log("Error creating account:", error);
      setErrorMessage(error.message || "Failed to create account");
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMessage("Email and password are required.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User logged in:", userCredential.user);
      navigate("/dashboard", {
        state: { firstTask: "Your first task goes here..." },
      });
    } catch (error: any) {
      console.error("Error logging in:", error);
      setErrorMessage(error.message || "Failed to login.");
    }
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setErrorMessage(""); // Clear any existing error messages

    if (!showLoginForm) {
      await handleCreateAccount();
    } else {
      await handleLogin();
    }
  };

  return (
    <div>
      <div className="flex justify-center items-center h-screen">
        <form
          onSubmit={handleSubmit}
          className="absolute top-1/2 left-1/2 w-64 h-110 bg-green-500 opacity-85 transform -translate-x-1/2 -translate-y-1/2"
        >
          {showLoginForm ? (
            <>
              <h1 className="font-cursive text-2xl text-black mb-4">
                Login to your account
              </h1>
              <input
                type="email"
                name="email"
                placeholder="Email"
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white opacity-50 w-48 h-10 my-2.5 rounded-full p-2 text-black"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                autoComplete="off"
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
              <button
                type="button"
                className="forgot bg-white opacity-50 w-full h-10 text-sm mb-2 rounded-full"
                onClick={handleCreateAccountView}
              >
                Create an Account
              </button>
            </>
          ) : (
            <>
              <h1 className="font-[KaushanScript] text-2xl text-black">
                Create an Account
              </h1>
              <input
                type="email"
                name="email"
                placeholder="Email"
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white opacity-50 w-48 h-10 my-2.5 rounded-full p-2 text-black"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white opacity-50 w-48 h-10 my-2.5 rounded-full p-2"
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
function setShowCreateAccountForm(arg0: boolean) {
  throw new Error("Function not implemented.");
}
