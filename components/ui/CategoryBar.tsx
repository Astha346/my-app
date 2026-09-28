
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
    <div className="w-full bg-white border-b">
      <div className="px-4 py-4">
        <h2 className="text-lg font-bold text-gray-900 mb-3">
          Shop by Category
        </h2>

        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition
                ${
                  selectedCategory === cat.value
                    ? "bg-black text-white"
                    : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                }
              `}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
