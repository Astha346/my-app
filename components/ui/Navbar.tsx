"use client";

import { Button } from "@/components/ui/button";
import SearchBar from "./SearchBar";
import CategoryBar from "./CategoryBar";

type NavbarProps = {
  email: string;
  onLogout: () => void;
  onNavigate: (page: "dashboard" | "products" | "users") => void;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
};

export default function Navbar({
  email,
  onLogout,
  onNavigate,
  searchTerm,
  setSearchTerm,
  categories,
  selectedCategory,
  setSelectedCategory,
}: NavbarProps) {
  return (
    <nav className="w-full flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-white dark:bg-zinc-900 shadow gap-4">
      
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Dashboard</h1>
        <span className="text-zinc-700 dark:text-zinc-300 px-3 py-2 border rounded-lg bg-gray-100 dark:bg-zinc-800 font-medium">
          {email}
        </span>
      </div>

      <div className="flex flex-1 items-center gap-2 min-w-75">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        <CategoryBar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>
      <div className="flex gap-2">
        <Button
          onClick={() => onNavigate("dashboard")}
          className="bg-black text-white py-2 px-4 rounded-lg hover:bg-zinc-800 shadow"
        >
          Product
        </Button>
        <Button
          onClick={() => onNavigate("users")}
          className="bg-black text-white py-2 px-4 rounded-lg hover:bg-zinc-800 shadow"
        >
          Users
        </Button>
        <Button
          onClick={onLogout}
          className="bg-black text-white py-2 px-4 rounded-lg hover:bg-zinc-800 shadow"
        >
          Logout
        </Button>
      </div>
    </nav>
  );
}