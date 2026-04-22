"use client";

import { Category } from "@/types/types";

type Props = {
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
};

export default function CategoryBar({
  categories,
  selectedCategory,
  setSelectedCategory,
}: Props) {
  return (
    <div className="w-full flex gap-2 overflow-x-auto p-3 bg-white border-b">

      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => setSelectedCategory(cat.value)}
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition
            ${
              selectedCategory === cat.value
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }
          `}
        >
          {cat.label}
        </button>
      ))}

    </div>
  );
}