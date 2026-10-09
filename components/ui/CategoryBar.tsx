
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
    <div className="w-full border-b border-border bg-background text-foreground transition-colors duration-200">
      <div className="px-4 py-4">
        <h2 className="mb-3 text-lg font-bold text-foreground">
          Shop by Category
        </h2>

        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setSelectedCategory(cat.value)}
              className={`whitespace-nowrap rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                selectedCategory === cat.value
                  ? "border-pink-600 bg-pink-600 text-white"
                  : "border-border bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}