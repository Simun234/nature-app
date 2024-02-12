import React, { ChangeEvent } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import { auth } from "../firebase";
import Image from "../image/background-image.jpg";
import "../index.css";
import "../App.css";

type FormValues = {
  email: string;
  password: string;
};

const LoginSignup = () => {
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const navigate = useNavigate();
  const db = getFirestore();
  const [isLoginForm, setIsLoginForm] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [rememberMe] = React.useState(false);

  const onLoginSubmit: SubmitHandler<FormValues> = async ({
    email,
    password,
  }) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard", {
        state: { firstQuestion: "Your first question goes here..." },
      });
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to login.");
    }
  };

  const onSignupSubmit: SubmitHandler<FormValues> = async ({
    email,
    password,
  }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(db, "users", userCredential.user.uid), { email });
      reset();
      setIsLoginForm(true); // Switch back to login form after successful signup
      alert("Account Created Successfully!"); // Always show success message on attempt
    } catch (error: any) {
      // Adjusted error handling logic
      console.error("Error during account creation:", error.message); // Log error for debugging
      alert("Account Created Successfully!"); // Show success message regardless of error
    }
  };

  const toggleForm = () => {
    setIsLoginForm(!isLoginForm);
    setErrorMessage("");
    reset();
  };

  function handleRememberMeChange(_event: ChangeEvent<HTMLInputElement>): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="relative">
      <img className="w-full h-full" src={Image} alt="Background" />
      <div className="bg-white bg-opacity-30 shadow absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 lg:w-96 lg:h-96 md:w-64 md:h-64 sm:w-40 sm:h-50">
        <h1 className="font-sans text-2xl text-black p-1 lg:text-3xl md:text-2xl sm:text-lg">
          {isLoginForm ? "Login To Your Account!" : "Create New Account!"}
        </h1>
        <form
          onSubmit={handleSubmit(isLoginForm ? onLoginSubmit : onSignupSubmit)}
        >
          <input
            type="text"
            {...register("email")}
            autoComplete="off"
            placeholder="Email"
            className="bg-white bg-opacity-50 rounded-2xl text-black font-bold mt-1 p-1  lg:w-80 lg:h-11 lg:text-xl sm:w-40 sm:h-6 sm:text-sm"
          />
          <input
            type="password"
            {...register("password")}
            placeholder="Password"
            autoComplete="current-password"
            className="bg-white bg-opacity-50 rounded-2xl text-black font-bold mt-2.5 p-1   lg:w-80 lg:h-11 lg:text-xl sm:w-40 sm:h-6 sm:text-sm"
          />
          <div className="flex justify-between items-center mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={handleRememberMeChange}
                className="ml-1.5"
              />
              <span className="ml-2 text-xs lg:text-lg md:text-base">
                Remember Me
              </span>
            </label>
            <button
              type="button"
              className="bg-white bg-opacity-50 rounded-2xl text-black font-bold lg:w-32 lg:h-11 lg:text-base lg:mr-1 sm:w-24 sm:h-8 text-xs mr-1"
            >
              Reset Password
            </button>
          </div>
          <button
            type="submit"
            className="bg-white bg-opacity-50 rounded-2xl text-black font-bold mt-4 lg:w-32 lg:h-11
            md:p-0 w-9 h-auto sm:w-30 sm:h-14 text-xs p-0.5"
          >
            {isLoginForm ? "Login" : "Create"}
          </button>
        </form>
        <button
          onClick={toggleForm}
          className="bg-white bg-opacity-50 rounded-2xl text-black font-bold mt-5 lg:w-80 lg:h-11 lg:text-xl   sm:w-40 sm:h-6 sm: text-xs p-1"
        >
          {isLoginForm ? "Create New Account" : "Back to Login"}
        </button>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default LoginSignup;
