import axios, { AxiosResponse } from "axios";
import {
  doc,
  updateDoc,
  setDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { db, auth, realtimeDb } from "../firebase";
import { FirebaseError } from "firebase/app";

// Set up Axios defaults
axios.defaults.baseURL = "https://nature-app-3fa1c-default-rtdb.firebaseio.com";
axios.defaults.withCredentials = true;
axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(
  "token"
)}`;

export const loginUser = async (email: string, password: string) => {
  try {
    const loginData = {
      email: email,
      password: password,
      returnSecureToken: true, // Required for Firebase REST API
    };
    const loginResponse: AxiosResponse = await axios.post(
      `
      AIzaSyDlZkNCRkoYcY4Uxy8Q-LXAMRVXPPp3kDQ`,
      loginData
    );
    const token = loginResponse.data.idToken; // Use idToken for Firebase

    localStorage.setItem("token", token);
    updateAxiosHeader(token);

    return null; // Return null to indicate success, or you can return the token if needed
  } catch (error) {
    console.error("Error logging in:", error);
    return "Failed to log in. Please try again."; // Return the error message
  }
};

export const resetPassword = async (email: string, newPassword: string) => {
  try {
    const userRef = doc(collection(db, "users"), email); // Use collection function to get a reference to "users" collection
    await updateDoc(userRef, { password: newPassword });
    return "Password reset successfully!";
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};

export const createAccount = async (email: string, password: string) => {
  try {
    const userRef = doc(collection(db, "users"), email);
    await setDoc(userRef, { password });
    return "Account created successfully!";
  } catch (error) {
    console.error("Error creating account:", error);
    if (error instanceof FirebaseError) {
      if (error.code === "permission-denied") {
        throw new Error(
          "Permission denied. Please check your Firebase security rules."
        );
      }
      // Handle other specific error cases if needed
    }
    throw error; // Re-throw the original error if it's not a known FirebaseError
  }
};

function updateAxiosHeader(token: string) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
