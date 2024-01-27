import React, { useState, useEffect } from "react";
import axios from "axios";

const TaskComponent = () => {
  const [task, setTask] = useState({
    name: "",
    description: "",
    deadlineForSubmission: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Set loading to true initially

  useEffect(() => {
    const fetchFirstTask = async () => {
      try {
        const apiBaseUrl =
          "https://nature-app-3fa1c-default-rtdb.firebaseio.com/api";
        const token = localStorage.getItem("token");

        // Ensure the token exists before making the request
        if (!token) {
          throw new Error("No token found. Please login again.");
        }

        const response = await axios.get(`${apiBaseUrl}/get-tasks.php`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.length > 0) {
          setTask(response.data);
        } else {
          setError("No task data available.");
        }
      } catch (error: any) {
        // Improved error handling
        setError(
          error.response?.data?.message ||
            error.message ||
            "An unexpected error occurred."
        );
        console.error("Fetch task error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFirstTask();
  }, []);

  const { name, description, deadlineForSubmission } = task;

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <p>Name: {name || "Not available"}</p>
          <p>Description: {description || "Not available"}</p>
          <p>Deadline: {deadlineForSubmission || "Not available"}</p>
          {error && <p>Error: {error}</p>}
        </div>
      )}
    </div>
  );
};

export default TaskComponent;
