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

export const fetchTasksFromFirestoreDatabase = async () => {
  try {
    const response: AxiosResponse = await axios.get(
      "/tasks/skkICu0bG2EGd75DLHGL"
    );
    const tasks = response.data.tasks;

    if (tasks && tasks.length > 0) {
      return tasks;
    } else {
      console.log("No tasks available.");
      return []; // Return an empty array as a fallback
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error; // Rethrowing the error to handle it in the component
  }
};

export const getTasks = async () => {
  try {
    const tasksCol = collection(db, "tasks");
    const taskSnapshot = await getDocs(tasksCol);
    return taskSnapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("Error fetching tasks from Firestore:", error);
    throw error;
  }
};

export const getFirstTaskPath = async () => {
  try {
    const tasksCol = collection(db, "tasks");
    const taskSnapshot = await getDocs(tasksCol);
    const tasks = taskSnapshot.docs.map((doc) => doc.data());

    if (tasks && tasks.length > 0) {
      const firstTask = tasks[0];
      const firstTaskPath = firstTask.tasks; // Replace 'tasks' with the actual field name in your Firestore documents
      return firstTaskPath;
    } else {
      console.log("No tasks available.");
      return ""; // Return an empty string or a default path as a fallback
    }
  } catch (error) {
    console.error("Error fetching the first task path:", error);
    throw error;
  }
};

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

    const taskResponse: AxiosResponse = await axios.get(
      "https://v1.nocodeapi.com/simun65/fbsdk/nAwvFKchoyVhzAzK/firestore/allDocuments?collectionName=tasks&limit=1"
    );
    const firstTask = taskResponse.data[0];

    return {
      token,
      firstTask,
    };
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const resetPassword = async (username: string, newPassword: string) => {
  try {
    const userRef = doc(db, "users", username);
    await updateDoc(userRef, { password: newPassword });
    return "Password reset successfully!";
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};

export const createAccount = async (username: string, password: string) => {
  try {
    const userRef = doc(db, "users", username);
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
