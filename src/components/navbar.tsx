"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

type LeftNavBarProps = {
  onQuestionTypeChange?: (type: 'number' | 'text' | 'checkbox' | 'calendar' | 'multiple-choice' | 'tekst-block' | 'dropdown') => void;
  flowName?: string; 
};

export default function LeftNavBar({
  onQuestionTypeChange,
  flowName,
}: LeftNavBarProps) {
  const pathname = usePathname();

  const isEditingFlow = pathname.startsWith("/flow/");

  const handleNavAway = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const confirmation = window.confirm(
      `Er du sikker på du vil forlade flowet: "${flowName}"?`
    );
    if (!confirmation) {
      e.preventDefault();
    }
  };

  return (
    <nav
      className="fixed left-0 top-0 h-full w-48 flex flex-col items-start p-6 space-y-4"
      style={{ backgroundColor: "#006e64" }}
    >
      <Link
        href="/"
        className="text-white hover:underline"
        onClick={isEditingFlow && flowName ? handleNavAway : undefined}
      >
        Home
      </Link>
      {isEditingFlow && (
        <div className="flex flex-col text-xl space-y-4 text-white">
          <button onClick={() => onQuestionTypeChange?.("number")}>
            Numerisk spørgsmål
          </button>
          <button onClick={() => onQuestionTypeChange?.("text")}>
            Tekst spørgsmål
          </button>
          <button onClick={() => onQuestionTypeChange?.('multiple-choice')}>
            Multiple Choice spørgsmål
          </button>
          <button onClick={() => onQuestionTypeChange?.('checkbox')}>
            Checkbox spørgsmål
          </button>
          <button onClick={() => onQuestionTypeChange?.('calendar')}>
           Kalender spørgsmål
          </button>
          <button onClick={() => onQuestionTypeChange?.('dropdown')}>
            Dropdown spørgsmål
          </button>
          <button onClick={() => onQuestionTypeChange?.('tekst-block')}>
            Tekstblok
          </button>
        </div>
      )}
    </nav>
  );
}

