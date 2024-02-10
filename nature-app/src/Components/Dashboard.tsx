import React, { useState } from "react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

const questions: Question[] = [
  {
    id: 0,
    question: "What is the process by which plants make their own food?",
    options: [
      " Photosynthesis",
      "Respiration",
      " Transpiration",
      "Pollination",
    ],
    correctAnswer: "Photosynthesis",
  },
  {
    id: 1,
    question:
      "What is the name of the process by which water evaporates from plants' leaves?",
    options: [
      "Condensation",
      " Transpiration",
      "Precipitation",
      " Infiltration",
    ],
    correctAnswer: "Transpiration",
  },
  {
    id: 2,
    question: "What is the hardest natural substance found on Earth?",
    options: ["Diamond", " Quartz", " Tungsten", "Graphite"],
    correctAnswer: "Diamond",
  },
  {
    id: 3,
    question:
      "What is the name of the process by which rocks are broken down into smaller pieces by wind, water, or ice?",
    options: ["Erosion", "Sublimation", "Weathering", "Sedimentation"],
    correctAnswer: "Weathering",
  },
  {
    id: 4,
    question: "What is the largest mammal on Earth?",
    options: [" Elephant", "Blue whale", " Giraffe", "Hippopotamus"],
    correctAnswer: "Blue whale",
  },
  {
    id: 5,
    question: "What type of animal is a frog?",
    options: ["Mammal", "Reptile", " Amphibian", "Insect"],
    correctAnswer: "Amphibian",
  },
  {
    id: 6,
    question:
      "What are the two main gases that make up the Earth's atmosphere?",
    options: [
      " Oxygen and nitrogen",
      "Carbon dioxide and oxygen",
      "Nitrogen and carbon dioxide",
      " Hydrogen and helium",
    ],
    correctAnswer: "Oxygen and nitrogen",
  },
  {
    id: 7,
    question: "What is the largest planet in our solar system?",
    options: ["Earth", "Saturn", "Jupiter", " Mars"],
    correctAnswer: " Jupiter",
  },
  {
    id: 8,
    question:
      "What is the process by which water falls from the atmosphere to the Earth's surface?",
    options: ["Condensation", "Precipitation", "Evaporation", "Transpiration"],
    correctAnswer: " Precipitation",
  },
  {
    id: 9,
    question:
      "What is the name for the study of living organisms and their interactions with each other and their environment?",
    options: ["Zoology", " Ecology", "Botany", "Microbiology"],
    correctAnswer: "Ecology",
  },
];

const QuestionList: React.FC<{}> = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score] = useState(0);

  if (currentQuestionIndex < 0 || currentQuestionIndex >= questions.length) {
    return <div>No questions available</div>; // Handle this case as needed
  }

  const currentQuestion: Question | undefined = questions[currentQuestionIndex];

  const handleSuccessClick = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      alert(
        `You've completed all questions! Your score is ${score}/${questions.length}`
      );
    }
  };

  return (
    <div>
      <h1 className="font-sans text-2xl text-black">Question</h1>
      <h2 className="font-sans text-2xl text-black">
        {currentQuestion?.question}
      </h2>
      <ul>
        {currentQuestion?.options.map((option, index) => (
          <li key={index}>{option}</li>
        ))}
      </ul>
      <button
        className="bg-white bg-opacity-50 rounded-2xl text-black"
        onClick={handleSuccessClick}
      >
        Next
      </button>
    </div>
  );
};

export default QuestionList;
