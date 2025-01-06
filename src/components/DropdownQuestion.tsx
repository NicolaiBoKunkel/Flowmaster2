'use client';

import { useState } from 'react';

type DropdownQuestionProps = {
  onAddQuestion: (question: any) => void;
};

export default function DropdownQuestion({ onAddQuestion }: DropdownQuestionProps) {
  const [questionText, setQuestionText] = useState<string>('');
  const [options, setOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState<string>('');

  const handleAddOption = () => {
    if (!newOption.trim()) return;
    setOptions([...options, newOption.trim()]);
    setNewOption('');
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleAddQuestion = () => {
    if (!questionText.trim() || options.length < 2) return;

    const newQuestion = {
      text: questionText.trim(),
      inputType: 'dropdown',
      options,
    };

    onAddQuestion(newQuestion);
    setQuestionText('');
    setOptions([]);
  };

  return (
    <div className="border p-4 rounded shadow-sm bg-gray-50 space-y-4 max-w-sm">
      <h2 className="text-xl font-semibold">Tilføj dropdown spørgsmål</h2>
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
          {options.map((option, index) => (
            <li
              key={index}
              className="flex justify-between items-center border p-2 rounded bg-white shadow-sm"
            >
              {option}
              <button
                onClick={() => handleRemoveOption(index)}
                className="text-red-500 hover:text-red-700"
              >
                Fjern
              </button>
            </li>
          ))}
        </ul>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Indtast nyt svar"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <button
            onClick={handleAddOption}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Tilføj
          </button>
        </div>
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

