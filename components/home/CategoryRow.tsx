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
    <div className="bg-white border-b px-4 py-3">
      
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        
        {categories.map((cat) => {
          const isActive = selected === cat.value;

          return (
            <button
              key={cat.value}
              onClick={() => setSelected(cat.value)}
              className={`
                whitespace-nowrap px-4 py-2 rounded-full text-sm
                transition-all duration-200
                ${
                  isActive
                    ? "bg-black text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }
              `}
            >
              {cat.label}
            </button>
          );
        })}

      </div>

    </div>
  );
}