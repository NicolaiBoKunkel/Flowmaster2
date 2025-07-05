"use client";

import { Question } from "@/utils/types";

type QuestionListProps = {
  questions: Question[];
  onDeleteQuestion: (index: number) => void;
};

export default function QuestionList({
  questions,
  onDeleteQuestion,
}: QuestionListProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mt-6">Spørgsmål på siden</h2>
      <ul className="space-y-4 max-w-sm">
        {questions.map((q, index) => (
          <li
            key={index}
            className="border p-4 rounded shadow-sm bg-gray-50"
          >
            <p className="font-medium">{q.text}</p>
            <p>Type: {q.inputType}</p>

            {q.inputType === "number" && <p>Spørgsmål: {q.text}</p>}

            {q.inputType === "text" && (
              <p>Placeholdertekst: {q.placeholder ?? "None"}</p>
            )}

            {q.inputType === "multiple-choice" && (
              <ul className="space-y-2">
                {q.answers?.map((answer, answerIndex) => (
                  <li key={answerIndex} className="border p-2 rounded">
                    {answer}
                  </li>
                ))}
                <p>
                  Tillad flere svar: {q.allowMultipleAnswers ? "Ja" : "Nej"}
                </p>
              </ul>
            )}

            {q.inputType === "checkbox" && (
              <>
                <p>Svar:</p>
                <ul className="space-y-2">
                  {q.options?.map((option, optionIndex) => (
                    <li key={optionIndex} className="border p-2 rounded">
                      {option}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {q.inputType === "dropdown" && (
              <>
                <p>Svar:</p>
                <ul className="space-y-2">
                  {q.options?.map((option, optionIndex) => (
                    <li key={optionIndex} className="border p-2 rounded">
                      {option}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {q.inputType === "calendar" && (
              <p>Dette er et Kalender spørgsmål.</p>
            )}

            {q.inputType === "tekst-block" ? (
              <>
                <p className="font-bold">{q.text}</p>
                <p className="italic">{q.body || q.placeholder}</p>
              </>
            ) : (
              <p className="font-medium">{q.text}</p>
            )}

            <button
              onClick={() => onDeleteQuestion(index)}
              className="bg-red-500 text-white px-2 py-1 rounded mt-2 hover:bg-red-600"
            >
              Slet
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
