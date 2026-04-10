"use client";

export default function CategoryBar({
  categories,
  selectedCategory,
  onSelectCategory,
}: {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}) {
  return (
    <div className="w-full max-w-xs">
      <select
        value={selectedCategory}
        onChange={(e) => onSelectCategory(e.target.value)}
        className="w-full px-2 py-2 rounded-lg border bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100"
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
}