import axios, { AxiosResponse } from "axios";
import {
  doc,
  updateDoc,
  setDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import db from "../firebase";

// Set up Axios defaults
axios.defaults.baseURL = "https://nature-app-3fa1c-default-rtdb.firebaseio.com";
axios.defaults.withCredentials = true;
axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(
  "token"
)}`;

export const loginUser = async (username: string, password: string) => {
  try {
    const loginData = { username, password };
    const loginResponse: AxiosResponse = await axios.post(
      "AIzaSyDlZkNCRkoYcY4Uxy8Q-LXAMRVXPPp3kDQ",
      loginData
    );
    const token = loginResponse.data.token;

    localStorage.setItem("token", token);
    updateAxiosHeader(token);
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const resetPassword = async (username: string, newPassword: string) => {
  try {
    const userRef = doc(collection(db, "users"), username); // Use collection function to get a reference to "users" collection
    await updateDoc(userRef, { password: newPassword });
    return "Password reset successfully!";
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};

export const createAccount = async (username: string, password: string) => {
  try {
    const userRef = doc(collection(db, "users"), username); // Use collection function to get a reference to "users" collection
    await setDoc(userRef, { password });
    return "Account created successfully!";
  } catch (error) {
    console.error("Error creating account:", error);
    throw error;
  }
};

function updateAxiosHeader(token: string) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
