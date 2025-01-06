'use client';

import { useState } from 'react';

type TextQuestionProps = {
  onAddQuestion: (question: any) => void;
};

export default function TextQuestion({ onAddQuestion }: TextQuestionProps) {
  const [text, setText] = useState('');
  const [placeholder, setPlaceholder] = useState('');

  const handleAddQuestion = () => {
    if (!text.trim()) return;

    const newQuestion = {
      text: text.trim(),
      inputType: 'text',
      placeholder: placeholder.trim() || undefined, // Optional placeholder
    };

    onAddQuestion(newQuestion);
    setText('');
    setPlaceholder('');
  };

  return (
    <div className="border p-4 rounded shadow-sm bg-gray-50 space-y-4 max-w-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Tilføj tekst spørgsmål</h2>
        <div className="group relative">
          <span className="text-gray-400 cursor-pointer">?</span>
          <div className="absolute right-0 -top-8 w-48 p-2 bg-gray-700 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Tekst spørgsmål er pt. ikke egnet til brug af post-conditions.
          </div>
        </div>
      </div>
      <input
        type="text"
        placeholder="Indtast spørgsmålstekst"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <input
        type="text"
        placeholder="Pladsholdertekst (valgfrit)"
        value={placeholder}
        onChange={(e) => setPlaceholder(e.target.value)}
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
