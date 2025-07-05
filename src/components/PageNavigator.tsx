"use client";

type PageNavigatorProps = {
  currentPageIndex: number;
  totalPages: number;
  onSetPageIndex: (index: number) => void;
  onAddPage: () => void;
};

export default function PageNavigator({
  currentPageIndex,
  totalPages,
  onSetPageIndex,
  onAddPage,
}: PageNavigatorProps) {
  return (
    <div className="flex space-x-2 mb-4">
      <button
        onClick={() => onSetPageIndex(0)}
        disabled={currentPageIndex === 0}
        className={`px-3 py-1 rounded ${
          currentPageIndex === 0
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        Første side
      </button>

      <button
        onClick={() => onSetPageIndex(currentPageIndex - 1)}
        disabled={currentPageIndex === 0}
        className={`px-3 py-1 rounded ${
          currentPageIndex === 0
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        Forrige side
      </button>

      <span className="px-3 py-1 rounded bg-blue-500 text-white">
        Side {currentPageIndex + 1} af {totalPages}
      </span>

      <button
        onClick={() => onSetPageIndex(currentPageIndex + 1)}
        disabled={currentPageIndex === totalPages - 1}
        className={`px-3 py-1 rounded ${
          currentPageIndex === totalPages - 1
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        Næste side
      </button>

      <button
        onClick={() => onSetPageIndex(totalPages - 1)}
        disabled={currentPageIndex === totalPages - 1}
        className={`px-3 py-1 rounded ${
          currentPageIndex === totalPages - 1
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        Sidste side
      </button>

      <button
        type="button"
        onClick={onAddPage}
        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
      >
        Tilføj ny side
      </button>
    </div>
  );
}
