"use client";

import React, { useState } from "react";

const evaluateCondition = (
  operator: string,
  userAnswer: string | number | string[],
  conditionValue: string | number | string[]
): boolean => {
  if (Array.isArray(userAnswer)) {
    if (Array.isArray(conditionValue)) {
      return conditionValue.every((val) => userAnswer.includes(val));
    }
    return userAnswer.includes(conditionValue as string);
  }

  if (typeof userAnswer === "number" && typeof conditionValue === "number") {
    switch (operator) {
      case "=":
        return userAnswer === conditionValue;
      case ">":
        return userAnswer > conditionValue;
      case "<":
        return userAnswer < conditionValue;
      case ">=":
        return userAnswer >= conditionValue;
      case "<=":
        return userAnswer <= conditionValue;
      default:
        return false;
    }
  }

  return userAnswer === conditionValue;
};

type Question = {
  text: string;
  inputType: string;
  placeholder?: string;
  body?: string;
  answers?: string[];
  options?: string[];
  allowMultipleAnswers?: boolean;
};

type PostCondition = {
  condition: {
    questionIndex: number;
    value: string | number | string[];
    operator?: string;
  };
  nextPageId: string;
};

type Page = {
  id: string;
  name: string;
  questions: Question[];
  postConditions?: PostCondition[];
};

type Flow = {
  pages: Page[];
};

type PlayModeProps = {
  flow: Flow;
  onExit: () => void;
};

export default function PlayMode({ flow, onExit }: PlayModeProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | number | string[]>>({});
  const [history, setHistory] = useState<number[]>([]);
  const [isEnd, setIsEnd] = useState(false);

  const currentPage = flow.pages[currentPageIndex];

  const handleAnswerChange = (index: number, value: string | number | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [currentPageIndex * 100 + index]: typeof value === "string" && !isNaN(Number(value)) ? Number(value) : value,
    }));
  };

  const handleNextPage = () => {
    const currentAnswers = answers;

    const matchedPostCondition = currentPage.postConditions?.find((condition) => {
      const answer = currentAnswers[currentPageIndex * 100 + condition.condition.questionIndex];
      const conditionValue = condition.condition.value;
      const operator = condition.condition.operator || "=";

      return evaluateCondition(operator, answer, conditionValue);
    });

    if (matchedPostCondition) {
      const nextPageIndex = flow.pages.findIndex((page) => page.id === matchedPostCondition.nextPageId);
      if (nextPageIndex !== -1) {
        setHistory((prevHistory) => [...prevHistory, currentPageIndex]); // Add current page to history
        setCurrentPageIndex(nextPageIndex);
        return;
      }
    }

    setIsEnd(true); // If no conditions are matched, end the flow
  };

  const handlePreviousPage = () => {
    if (history.length > 0) {
      const previousPageIndex = history[history.length - 1]; // Get the last visited page
      setHistory((prevHistory) => prevHistory.slice(0, -1)); // Remove the last entry from history
      setCurrentPageIndex(previousPageIndex);
    }
  };

  if (isEnd) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Flow er afsluttet</h2>
          <h3 className="text-lg font-semibold mb-2">Du har svaret:</h3>
          <ul className="list-disc ml-6">
            {flow.pages.map((page, pageIndex) => (
              <li key={pageIndex} className="mb-4">
                <strong>{page.name}</strong>
                <ul className="list-disc ml-6">
                  {page.questions.map((q, questionIndex) => (
                    <li key={questionIndex}>
                      {q.text}: {answers[pageIndex * 100 + questionIndex] || "No answer"}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <button
            onClick={onExit}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600"
          >
            Afslut Play Mode
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">{currentPage.name}</h2>
        <ul className="space-y-4">
          {currentPage.questions.map((q, index) => (
            <li key={index} className="border p-4 rounded shadow-sm bg-gray-50">
              <p className="font-medium mb-2">{q.text}</p>
              {q.inputType === "number" ? (
                <input
                  type="number"
                  value={answers[currentPageIndex * 100 + index] || ""}
                  onChange={(e) => handleAnswerChange(index, Number(e.target.value))}
                  className="border p-2 rounded w-full"
                />
              ) : q.inputType === "text" ? (
                <input
                  type="text"
                  value={answers[currentPageIndex * 100 + index] || ""}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  className="border p-2 rounded w-full"
                />
              ) : q.inputType === "multiple-choice" && q.answers ? (
                <div className="flex flex-col space-y-2">
                  {q.answers.map((option, optionIndex) => (
                    <button
                      key={optionIndex}
                      onClick={() => {
                        if (q.allowMultipleAnswers) {
                          const currentAnswers = Array.isArray(answers[currentPageIndex * 100 + index])
                            ? (answers[currentPageIndex * 100 + index] as string[])
                            : [];
                          const newAnswers = currentAnswers.includes(option)
                            ? currentAnswers.filter((a) => a !== option)
                            : [...currentAnswers, option];
                          handleAnswerChange(index, newAnswers);
                        } else {
                          handleAnswerChange(index, option);
                        }
                      }}
                      className={`p-2 rounded border w-full ${
                        (Array.isArray(answers[currentPageIndex * 100 + index]) &&
                          (answers[currentPageIndex * 100 + index] as string[]).includes(option)) ||
                        answers[currentPageIndex * 100 + index] === option
                          ? "bg-blue-100 border-blue-500"
                          : "hover:bg-gray-200"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : q.inputType === "dropdown" && q.options ? (
                <select
                  value={answers[currentPageIndex * 100 + index] || ""}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  className="border p-2 rounded w-full"
                >
                  <option value="">Select an option</option>
                  {q.options.map((option, optionIndex) => (
                    <option key={optionIndex} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : q.inputType === "checkbox" && q.options ? (
                <div className="mt-2">
                  {q.options.map((option, optionIndex) => (
                    <label key={optionIndex} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={option}
                        checked={
                          Array.isArray(answers[currentPageIndex * 100 + index]) &&
                          (answers[currentPageIndex * 100 + index] as string[]).includes(option)
                        }
                        onChange={(e) => {
                          const currentAnswers = Array.isArray(answers[currentPageIndex * 100 + index])
                            ? (answers[currentPageIndex * 100 + index] as string[])
                            : [];
                          if (q.allowMultipleAnswers) {
                            if (e.target.checked) {
                              handleAnswerChange(index, [...currentAnswers, option]);
                            } else {
                              handleAnswerChange(
                                index,
                                currentAnswers.filter((opt) => opt !== option)
                              );
                            }
                          } else {
                            handleAnswerChange(index, e.target.checked ? [option] : []);
                          }
                        }}
                        className="mr-2"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              ) : q.inputType === "calendar" ? (
                <input
                  type="date"
                  value={answers[currentPageIndex * 100 + index] || ""}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  className="border p-2 rounded w-full"
                />
              )
              : q.inputType === "tekst-block" ? (
                <>
                  <p className="font-bold">{q.text}</p> {/* Titel */}
                  <p className="italic">{q.body || q.placeholder}</p> {/* Brødtekst */}
                </>
              ) : null}
            </li>
          ))}
        </ul>
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePreviousPage}
            disabled={history.length === 0}
            className={`bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 ${
              history.length === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Tilbage
          </button>
          <button
            onClick={handleNextPage}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}


