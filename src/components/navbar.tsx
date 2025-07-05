"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

type LeftNavBarProps = {
  onQuestionTypeChange?: (
    type:
      | "number"
      | "text"
      | "checkbox"
      | "calendar"
      | "multiple-choice"
      | "tekst-block"
      | "dropdown"
  ) => void;
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
      className="fixed top-0 left-0 w-full flex items-center justify-between px-6 py-4 shadow-md z-50"
      style={{ backgroundColor: "#006e64" }}
    >
      <div className="flex items-center space-x-6">
        <Link
          href="/"
          className="text-white text-lg font-semibold hover:underline"
          onClick={isEditingFlow && flowName ? handleNavAway : undefined}
        >
          Home
        </Link>

        {isEditingFlow && (
          <div className="flex items-center space-x-4 text-white text-sm">
            <button onClick={() => onQuestionTypeChange?.("number")}>
              Numerisk
            </button>
            <button onClick={() => onQuestionTypeChange?.("text")}>
              Tekst
            </button>
            <button onClick={() => onQuestionTypeChange?.("multiple-choice")}>
              Multiple Choice
            </button>
            <button onClick={() => onQuestionTypeChange?.("checkbox")}>
              Checkbox
            </button>
            <button onClick={() => onQuestionTypeChange?.("calendar")}>
              Kalender
            </button>
            <button onClick={() => onQuestionTypeChange?.("dropdown")}>
              Dropdown
            </button>
            <button onClick={() => onQuestionTypeChange?.("tekst-block")}>
              Tekstblok
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
