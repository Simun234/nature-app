import React, { useState } from "react";
import Image from "../image/background-image(quiz).jpg";

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
    options: ["Photosynthesis", "Respiration", "Transpiration", "Pollination"],
    correctAnswer: "Photosynthesis",
  },
  {
    id: 1,
    question:
      "What is the name of the process by which water evaporates from plants' leaves?",
    options: ["Condensation", "Transpiration", "Precipitation", "Infiltration"],
    correctAnswer: "Transpiration",
  },
  {
    id: 2,
    question: "What is the hardest natural substance found on Earth?",
    options: ["Diamond", "Quartz", "Tungsten", "Graphite"],
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
    options: ["Elephant", "Blue whale", "Giraffe", "Hippopotamus"],
    correctAnswer: "Blue whale",
  },
  {
    id: 5,
    question: "What type of animal is a frog?",
    options: ["Mammal", "Reptile", "Amphibian", "Insect"],
    correctAnswer: "Amphibian",
  },
  {
    id: 6,
    question:
      "What are the two main gases that make up the Earth's atmosphere?",
    options: [
      "Oxygen and nitrogen",
      "Carbon dioxide and oxygen",
      "Nitrogen and carbon dioxide",
      "Hydrogen and helium",
    ],
    correctAnswer: "Oxygen and nitrogen",
  },
  {
    id: 7,
    question: "What is the largest planet in our solar system?",
    options: ["Earth", "Saturn", "Jupiter", "Mars"],
    correctAnswer: "Jupiter",
  },
  {
    id: 8,
    question:
      "What is the process by which water falls from the atmosphere to the Earth's surface?",
    options: ["Condensation", "Precipitation", "Evaporation", "Transpiration"],
    correctAnswer: "Precipitation",
  },
  {
    id: 9,
    question:
      "What is the name for the study of living organisms and their interactions with each other and their environment?",
    options: ["Zoology", "Ecology", "Botany", "Microbiology"],
    correctAnswer: "Ecology",
  },
];

const QuestionList: React.FC<{}> = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const currentQuestion: Question | undefined = questions[currentQuestionIndex];

  const handleOptionClick = (option: string) => {
    setSelectedAnswer(option);
  };

  const handleSuccessClick = () => {
    if (selectedAnswer === currentQuestion?.correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null); // Reset selected answer for the next question
    } else {
      alert(
        `You've completed all questions! Your score is ${score}/${questions.length}`
      );
    }
  };

  return (
    <div className="h-screen relative">
      <img
        src={Image}
        alt="Background"
        className="object-cover w-full h-full"
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-30 shadow p-8 rounded-lg">
        {currentQuestion && (
          <div>
            <p className="text-black font-bold">{currentQuestion.question}</p>
            {currentQuestion.options.map((option, index) => (
              <div key={index}>
                <input
                  type="radio"
                  id={option}
                  name="options"
                  value={option}
                  checked={option === selectedAnswer}
                  onChange={() => handleOptionClick(option)}
                />
                <label htmlFor={option}>{option}</label>
              </div>
            ))}
          </div>
        )}
        <button
          className="bg-white bg-opacity-50 rounded-2xl text-black font-bold mt-6 lg:w-32 lg:h-11 sm:w-24 sm:h-8"
          onClick={handleSuccessClick}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default QuestionList;
