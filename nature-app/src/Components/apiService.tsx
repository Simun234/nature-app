import axios, { AxiosResponse } from "axios";
import { SubmitHandler } from "react-hook-form";

// Set up Axios defaults
axios.defaults.baseURL = "https://nature-app-3fa1c-default-rtdb.firebaseio.com";
axios.defaults.withCredentials = true;
axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(
  "token"
)}`;

export const onLoginSubmit: SubmitHandler<{
  email: string;
  password: string;
}> = async (data) => {
  const { email, password } = data;

  try {
    const loginData = {
      email: email,
      password: password,
      returnSecureToken: true, // Required for Firebase REST API
    };
    const loginResponse: AxiosResponse<any> = await axios.post(
      `AIzaSyDlZkNCRkoYcY4Uxy8Q-LXAMRVXPPp3kDQ`,
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

function updateAxiosHeader(token: string) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
