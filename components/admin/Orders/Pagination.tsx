
"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  if (totalItems === 0) {
    return null;
  }

  const startItem =
    (currentPage - 1) * itemsPerPage + 1;

  const endItem = Math.min(
    currentPage * itemsPerPage,
    totalItems
  );

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    }

    pages.push(1);

    if (currentPage > 4) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(
      totalPages - 1,
      currentPage + 1
    );

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 3) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="mt-4 flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Showing text */}
      <p className="text-sm text-slate-500">
        Showing{" "}
        <span className="font-medium text-slate-700">
          {startItem}
        </span>{" "}
        to{" "}
        <span className="font-medium text-slate-700">
          {endItem}
        </span>{" "}
        of{" "}
        <span className="font-medium text-slate-700">
          {totalItems}
        </span>{" "}
        orders
      </p>

      {/* Pagination buttons */}
      <div className="flex items-center gap-1">
        {/* Previous */}
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() =>
            onPageChange(currentPage - 1)
          }
          className="flex h-9 w-9 items-center justify-center rounded-lg border bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`dots-${index}`}
                className="flex h-9 w-9 items-center justify-center text-sm text-slate-400"
              >
                ...
              </span>
            );
          }

          const pageNumber = page as number;

          return (
            <button
              key={pageNumber}
              type="button"
              onClick={() =>
                onPageChange(pageNumber)
              }
              className={`flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm font-medium transition ${
                currentPage === pageNumber
                  ? "border-purple-600 bg-purple-600 text-white"
                  : "bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {pageNumber}
            </button>
          );
        })}

        {/* Next */}
        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() =>
            onPageChange(currentPage + 1)
          }
          className="flex h-9 w-9 items-center justify-center rounded-lg border bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

