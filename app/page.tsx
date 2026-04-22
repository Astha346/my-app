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

/* CATEGORIES (SAFE STRUCTURE) */
const categories: Category[] = [
  { label: "All", value: "all" },
  { label: "Beauty", value: "beauty" },
  { label: "Fragrances", value: "fragrances" },
  { label: "Furniture", value: "furniture" },
  { label: "Groceries", value: "groceries" },
  { label: "Laptops", value: "laptops" },
  { label: "Mens Shirts", value: "mens-shirts" },
  { label: "Womens Dresses", value: "womens-dresses" },
];

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState<Page>("dashboard");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  /* LOGIN */
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  /* FETCH API */
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

  /* FILTER */
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
    <div className="min-h-screen bg-gray-50">

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

      {page === "users" && (
        <div className="p-6">
          <UsersTable initialUsers={sampleUsers} />
        </div>
      )}

    </div>
  );
}