'use client';

import { useState } from "react";

type MultipleChoiceQuestionProps = {
  onAddQuestion: (question: any) => void;
};

export default function MultipleChoiceQuestion({
  onAddQuestion,
}: MultipleChoiceQuestionProps) {
  const [questionText, setQuestionText] = useState<string>("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [newAnswer, setNewAnswer] = useState<string>("");
  const [allowMultipleAnswers, setAllowMultipleAnswers] = useState<boolean>(
    false
  );

  const handleAddAnswer = () => {
    if (!newAnswer.trim()) return;
    setAnswers([...answers, newAnswer.trim()]);
    setNewAnswer("");
  };

  const handleRemoveAnswer = (index: number) => {
    setAnswers(answers.filter((_, i) => i !== index));
  };

  const handleAddQuestion = () => {
    if (!questionText.trim() || answers.length < 2) return;

    const newQuestion = {
      text: questionText.trim(),
      inputType: "multiple-choice",
      answers,
      allowMultipleAnswers,
    };

    onAddQuestion(newQuestion);
    setQuestionText("");
    setAnswers([]);
    setAllowMultipleAnswers(false);
  };

  return (
    <div className="border p-4 rounded shadow-sm bg-gray-50 space-y-4 max-w-sm">
      <h2 className="text-xl font-semibold">Tilføj multiple choice spørgsmål</h2>
      <input
        type="text"
        placeholder="Indtast spørgsmålstekst"
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <div className="space-y-2">
        <h3 className="font-medium">Svar:</h3>
        <ul className="space-y-2">
          {answers.map((answer, index) => (
            <li
              key={index}
              className="flex justify-between items-center border p-2 rounded bg-white shadow-sm"
            >
              {answer}
              <button
                onClick={() => handleRemoveAnswer(index)}
                className="text-red-500 hover:text-red-700"
              >
                Slet
              </button>
            </li>
          ))}
        </ul>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Indtast nyt svar"
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <button
            onClick={handleAddAnswer}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Tilføj
          </button>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="allowMultipleAnswers"
          checked={allowMultipleAnswers}
          onChange={(e) => setAllowMultipleAnswers(e.target.checked)}
        />
        <label htmlFor="allowMultipleAnswers">Tillad flere svar</label>
      </div>
      <button
        onClick={handleAddQuestion}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Tilføj spørgsmål
      </button>
    </div>
  );
}



