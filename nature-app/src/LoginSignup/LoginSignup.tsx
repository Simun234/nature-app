import React from "react";
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
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();
  const navigate = useNavigate();
  const db = getFirestore();
  const [isLoginForm, setIsLoginForm] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState("");

  const onLoginSubmit: SubmitHandler<FormValues> = async ({
    email,
    password,
  }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      navigate("/dashboard", {
        state: { firstTask: "Your first task goes here..." },
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
      setErrorMessage("Account created successfully! Please login.");
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to create account.");
    }
  };

  const toggleForm = () => {
    setIsLoginForm(!isLoginForm);
    setErrorMessage("");
    reset();
  };

  return (
    <div className="relative">
      <img className="w-full h-full" src={Image} alt="Background" />
      <div className="bg-white bg-opacity-30 shadow absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 lg:w-96 lg:h-96 md:w-64 md:h-64 sm:w-48 sm:h-64">
        <h1 className="font-sans text-2xl text-black p-1 lg:text-3xl md:text-2xl sm:text-lg">
          {isLoginForm ? "Login To Your Account!" : "Create New Account"}
        </h1>
        <form
          onSubmit={handleSubmit(isLoginForm ? onLoginSubmit : onSignupSubmit)}
        >
          <input
            type="text"
            {...register("email")}
            autoComplete="off"
            placeholder="Email"
            className="bg-white bg-opacity-50 rounded-2xl text-black font-bold mt-3 lg:w-80 lg:h-11 lg:text-xl sm:w-40 sm:h-6 sm:text-sm"
          />
          <input
            type="password"
            {...register("password")}
            placeholder="Password"
            autoComplete="current-password"
            className="bg-white bg-opacity-50 rounded-2xl text-black font-bold mt-4 lg:w-80 lg:h-11 lg:text-xl sm:w-40 sm:h-6 sm:text-sm"
          />
          <button
            type="submit"
            className="bg-white bg-opacity-50 rounded-2xl text-black font-bold mt-6 lg:w-32 lg:h-11 sm:w-24 sm:h-8"
          >
            {isLoginForm ? "Login" : "Sign Up"}
          </button>
        </form>
        <button
          onClick={toggleForm}
          className="bg-white bg-opacity-50 rounded-2xl text-black font-bold mt-5 lg:w-80 lg:h-11 lg:text-xl sm:w-40 sm:h-6 sm:text-sm"
        >
          {isLoginForm ? "Create New Account" : "Back to Login"}
        </button>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default LoginSignup;
