'use client';

import { useState } from 'react';

type NumericQuestionProps = {
  onAddQuestion: (question: any) => void;
};

export default function NumericQuestion({ onAddQuestion }: NumericQuestionProps) {
  const [text, setText] = useState('');

  const handleAddQuestion = () => {
    if (!text.trim()) return;

    const newQuestion = {
      text: text.trim(),
      inputType: 'number', // Numeric question type
    };

    onAddQuestion(newQuestion);
    setText(''); // Reset input field
  };

  return (
    <div className="border p-4 rounded shadow-sm bg-gray-50 space-y-4 max-w-sm">
      <h2 className="text-xl font-semibold">Tilføj numerisk spørgsmål</h2>
      <input
        type="text"
        placeholder="Indtast spørgsmålstekst"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <button
        onClick={handleAddQuestion}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Tilføj spørgsmål
      </button>
    </div>
  );
}
