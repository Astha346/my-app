import { Category } from "@/types/types";

type Props = {
  categories: Category[];
  selected: string;
  setSelected: (value: string) => void;
};

export default function CategoryRow({
  categories,
  selected,
  setSelected,
}: Props) {
  return (
    <section className="w-full bg-white px-4 py-5 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-375">
        
        {/* Section heading */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-gray-900 sm:text-xl">
            Shop by Category
          </h2>

          <span className="text-sm font-medium text-gray-400">
            {categories.length} categories
          </span>
        </div>

        {/* Categories */}
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => {
            const isActive = selected === cat.value;

            return (
              <button
                key={cat.value}
                onClick={() => setSelected(cat.value)}
                className={`
                  whitespace-nowrap rounded-xl px-5 py-3
                  text-sm font-bold
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-black text-white shadow-md"
                      : "border border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-gray-100"
                  }
                `}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}