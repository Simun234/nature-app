import React from "react";
import { useForm } from "react-hook-form";
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

const LoginSignup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const navigate = useNavigate();
  const db = getFirestore();
  const [showLoginForm, setShowLoginForm] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState("");

  const onLoginSubmit = async (data: { email: any; password: any }) => {
    const { email, password } = data;
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

  const onSignupSubmit = async (data: { email: any; password: any }) => {
    const { email, password } = data;
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Account created:", userCredential.user);

      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
      });

      reset();
      setShowLoginForm(true); // Switch to login form after successful signup
      setErrorMessage("Account created successfully! Please login.");
    } catch (error: any) {
      console.log("Error creating account:", error);
      setErrorMessage(error.message || "Failed to create account.");
    }
  };

  const handleFormSwitch = () => {
    setShowLoginForm(!showLoginForm);
    setErrorMessage("");
    reset();
  };

  return (
    <div className="relative">
      <img className="w-full h-full" src={Image} alt="Your image" />
      <div className="bg-white bg-opacity-30 shadow  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 lg:w-96 lg:h-96  md:w-64 md:h-64 sm:w-48 sm:h-64">
        <h1 className=" font-sans text-2xl text-black p-1 lg:text-3xl md:text-2xl sm:text-lg ">
          Login To Your Account!
        </h1>
        <input
          className="bg-white bg-opacity-50 rounded-2xl text-black font-bold  mt-3 lg:w-80  lg:h-11 lg:text-xl sm:w-40 sm:h-6 sm:text-sm"
          type="text"
          placeholder="Email"
        />
        <input
          className="bg-white bg-opacity-50 rounded-2xl text-black font-bold  mt-4 lg:w-80  lg:h-11 lg:text-xl sm:w-40 sm:h-6 sm:text-sm"
          type="text"
          placeholder="Password"
        />
        <br />
        <button
          type="submit"
          className="bg-white bg-opacity-50 rounded-2xl text-black font-bold mt-6 lg:w-32 lg:h-11 sm:w-24 sm:h-8"
        >
          Login
        </button>
        <br />
        <button className="bg-white bg-opacity-50 rounded-2xl text-black font-bold  mt-5 lg:w-80  lg:h-11 lg:text-xl sm:w-40 sm:h-6 sm:text-sm">
          Create New Account
        </button>
      </div>
    </div>
  );
};

export default LoginSignup;
function setShowCreateAccountForm(_arg0: boolean) {
  throw new Error("Function not implemented.");
}
