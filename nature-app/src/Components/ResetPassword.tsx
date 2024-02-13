import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth"; // Corrected import
import Image from "../image/background-image.jpg";
import "../index.css";

interface FormValues {
  email: string;
}

const ResetPassword: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const navigate = useNavigate();
  const auth = getAuth(); // Get the auth instance

  const onSubmit = async (data: FormValues) => {
    const { email } = data;

    if (!email) {
      alert("Please provide an email address.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email, {
        // Ensure this URL is correctly pointing to your application's password reset handler
        url: "https://nature-app-3fa1c.firebaseapp.com/__/auth/action?mode=action&oobCode=code",
        handleCodeInApp: true, // Optional: if you want to handle the action code in the app
      });
      alert("Password reset email sent. Please check your inbox.");
      navigate("/success");
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        alert("No user found with this email address.");
      } else {
        alert(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div className="relative">
      <img src={Image} alt="Background" />
      <div className="bg-white bg-opacity-30 shadow absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 lg:w-96 lg:h-64 md:w-64 md:h-64 sm:w-40 sm:h-50">
        <h1 className="font-sans text-2xl text-black p-1 lg:text-3xl md:text-2xl sm:text-lg">
          Reset Your Password
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="email"
            placeholder="Enter your email"
            {...register("email", { required: "Email is required" })}
            className="bg-white bg-opacity-50 rounded-2xl text-black font-bold mt-7 p-1 lg:w-80 lg:h-11 lg:text-xl sm:w-40 sm:h-6 sm:text-sm"
          />
          {errors.email && <p>{errors.email.message}</p>}
          <button
            type="submit"
            className="bg-white bg-opacity-50 rounded-2xl text-black font-bold mt-4 lg:w-32 lg:h-11 md:p-0 w-9 h-auto sm:w-30 sm:h-14 text-xs p-0.5"
          >
            Send Reset Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
