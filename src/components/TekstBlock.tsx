'use client';

import { useState } from 'react';

type TekstBlockProps = {
  onAddTekstBlock: (tekstBlock: any) => void;
};

export default function TekstBlock({ onAddTekstBlock }: TekstBlockProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleAddTekstBlock = () => {
    if (!title.trim() || !body.trim()) return;

    const newTekstBlock = {
      text: title.trim(), // Titel
      inputType: 'tekst-block', // Type som string
      body: body.trim(), // Brødtekst
    };

    onAddTekstBlock(newTekstBlock);
    setTitle('');
    setBody('');
  };

  return (
    <div className="border p-4 rounded shadow-sm bg-gray-50 space-y-4 max-w-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Tilføj tekstblok</h2>
        <div className="group relative">
          <span className="text-gray-400 cursor-pointer">?</span>
          <div className="absolute right-0 -top-8 w-48 p-2 bg-gray-700 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Tekstblokke er pt. ikke egnet til brug af post-conditions.
          </div>
        </div>
      </div>
      <input
        type="text"
        placeholder="Indtast titel"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <textarea
        placeholder="Indtast brødtekst"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <button
        onClick={handleAddTekstBlock}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Tilføj tekstblok
      </button>
    </div>
  );
}
