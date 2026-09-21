import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = (): number[] => {
    // Always show exactly 3 consecutive pages, clamped to the valid range at the edges.
    let start = currentPage - 1;
    let end = currentPage + 1;

    if (start < 1) {
      start = 1;
      end = Math.min(totalPages, 3);
    }

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, totalPages - 2);
    }

    const pages: number[] = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition disabled:cursor-not-allowed disabled:opacity-30 enabled:hover:bg-gray-100 enabled:hover:text-black"
      >
        <ChevronLeft size={18} />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold transition ${
            page === currentPage
              ? "bg-linear-to-b from-gray-800 via-gray-700 to-black text-white shadow-md shadow-black/10"
              : "text-gray-500 hover:bg-gray-100 hover:text-black"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition disabled:cursor-not-allowed disabled:opacity-30 enabled:hover:bg-gray-100 enabled:hover:text-black"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}