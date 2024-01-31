import React, { useState } from "react";

interface Task {
  id: number;
  title: string;
  description: string;
  Deadlineforsubmission: string;
}

const tasks: Task[] = [
  {
    id: 0,
    title: "Photo Identification Challenge",
    description:
      "Participate in a photo identification challenge and test your knowledge by identifying various objects, scenes, or entities within images.",
    Deadlineforsubmission: "Three days",
  },
  {
    id: 1,
    title: "Plant a Tree Campaign",
    description:
      "Join our Plant a Tree Campaign and contribute to reforestation efforts by planting trees to combat climate change and preserve our environment.",
    Deadlineforsubmission: "Five days",
  },
  {
    id: 2,
    title: "Nature Sounds and Meditation",
    description:
      "Immerse yourself in the serenity of nature with our Nature Sounds and Meditation sessions, designed to provide relaxation and inner peace through the soothing sounds of the natural world.",
    Deadlineforsubmission: "Ten days",
  },
];

const TaskList: React.FC<{}> = () => {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

  if (currentTaskIndex < 0 || currentTaskIndex >= tasks.length) {
    return <div>No tasks available</div>; // Handle this case as needed
  }

  const currentTask: Task | undefined = tasks[currentTaskIndex];

  const handleSuccessClick = () => {
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
    } else {
      alert("You've completed all tasks!");
    }
  };

  return (
    <div>
      <h1>Task</h1>
      <h2>{currentTask?.title}</h2>
      <p>{currentTask?.description}</p>
      <p>Deadline: {currentTask?.Deadlineforsubmission}</p>
      <button onClick={handleSuccessClick}>Success</button>
    </div>
  );
};

export default TaskList;
