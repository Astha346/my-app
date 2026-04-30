"use client";

import { useEffect, useState } from "react";

import Navbar from "@/components/ui/Navbar";
import AuthForm from "@/components/ui/AuthForm";
import UsersTable from "@/components/ui/UserTable";

import Hero from "@/components/home/Hero";
import PromoBanner from "@/components/home/PromoBanner";
import ProductSection from "@/components/home/ProductSection";
import CategoryBar from "@/components/ui/CategoryBar";

import {
  User,
  Product,
  Category,
  toProductCard,
} from "@/types/types";

type Page = "dashboard" | "users";

/* USERS */
const sampleUsers: User[] = [
  { _id: "1", username: "Aastha", email: "a@example.com" },
  { _id: "2", username: "Ram", email: "ram@example.com" },
  { _id: "3", username: "Gita", email: "gita@example.com" },
];

/* CATEGORIES */
const categories: Category[] = [
  { label: "All", value: "all" },
  { label: "Beauty", value: "beauty" },
  { label: "Fragrances", value: "fragrances" },
  { label: "Furniture", value: "furniture" },
  { label: "Groceries", value: "groceries" },
  { label: "Laptops", value: "laptops" },
  { label: "Mens Shirts", value: "mens-shirts" },
];

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState<Page>("dashboard");

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const [selectedCategory, setSelectedCategory] = useState("all");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  /* LOGIN */
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  /* FETCH PRODUCTS */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://dummyjson.com/products?limit=100");
        const data = await res.json();
        setProducts(data.products);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* LOCAL SUGGESTIONS */
  const getLocalSuggestions = (value: string) => {
    if (!value) return [];

    return products
      .filter((p) =>
        p.title.toLowerCase().includes(value.toLowerCase())
      )
      .slice(0, 6)
      .map((p) => p.title);
  };

  /* SEARCH + AUTOCOMPLETE */
  useEffect(() => {
    if (!search) {
      setSuggestions([]);
      return;
    }

    // instant local suggestions
    const local = getLocalSuggestions(search);
    setSuggestions(local);

    // API suggestions (optional)
    const delay = setTimeout(async () => {
      try {
        const res = await fetch(`/api/suggestions?q=${search}`);
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          setSuggestions(data);
        } else {
          setSuggestions(local);
        }
      } catch {
        setSuggestions(local);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [search, products]);

  /* FILTER PRODUCTS */
  const filtered = products.filter((p) => {
    const matchSearch = p.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      selectedCategory === "all" || p.category === selectedCategory;

    return matchSearch && matchCategory;
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AuthForm onLogin={(u) => setUser(u)} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">

      <Navbar
        email={user.email}
        onLogout={() => setUser(null)}
        onNavigate={setPage}
        searchTerm={search}
        setSearchTerm={setSearch}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* 🔍 SEARCH DROPDOWN SUGGESTIONS */}
      {search && suggestions.length > 0 && (
        <ul className="absolute top-20 left-6 w-64 bg-white border rounded shadow z-50">
          {suggestions.map((item, i) => (
            <li
              key={i}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setSearch(item);
                setSuggestions([]);
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}

      {/* DASHBOARD */}
      {page === "dashboard" && (
        <>
          <Hero />

          <CategoryBar
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          <ProductSection
            title="Deals"
            products={filtered.slice(0, 8).map(toProductCard)}
          />

          <PromoBanner />

          <ProductSection
            title="More Products"
            products={filtered.slice(8, 16).map(toProductCard)}
          />
        </>
      )}

      {/* USERS */}
      {page === "users" && (
        <div className="p-6">
          <UsersTable initialUsers={sampleUsers} />
        </div>
      )}

    </div>
  );
}