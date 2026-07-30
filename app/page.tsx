"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import Navbar from "@/components/ui/Navbar";
import AuthForm from "@/components/ui/AuthForm";
import Hero from "@/components/home/Hero";
import PromoBanner from "@/components/home/PromoBanner";
import ProductSection from "@/components/home/ProductSection";
import CategoryBar from "@/components/ui/CategoryBar";
import MiddleBanner from "@/components/MiddleBanner";

import {
  User,
  Product,
  Category,
  toProductCard,
} from "@/types/types";

type Page = "dashboard" | "users";

const categories: Category[] = [
  { label: "All", value: "all" },
  { label: "Beauty", value: "Beauty" },
  { label: "Fragrances", value: "Fragrances" },
  { label: "Furniture", value: "Furniture" },
  { label: "Groceries", value: "Groceries" },
  { label: "Laptops", value: "Laptops" },
  { label: "Mens Shirts", value: "Mens Shirts" },
];

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [page] = useState<Page>("dashboard");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Restore Login
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      return;
    }

    try {
      const decoded: any = jwtDecode(token);

      setUser({
        id: decoded.id,
        username: decoded.username,
        email: decoded.email,
        role: decoded.role,
      });
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      setUser(null);
    }
  }, []);

  // Fetch Products
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await axios.get("http://localhost:3001/products");
         setProducts(res.data);
        
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Search Suggestions
  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }

    const result = products
      .filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      )
      .slice(0, 6)
      .map((product) => product.name);

    setSuggestions(result);
  }, [search, products]);

  // Filter Products
  const filteredProducts = products.filter((product) => {
    const searchMatch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const categoryMatch =
      selectedCategory === "all" ||
      product.category === selectedCategory;

    return searchMatch && categoryMatch;
  });

  if (!user) {
    return (
      <AuthForm
        onLogin={(loggedUser) => {
          setUser(loggedUser);
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-lg font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50">
      <Navbar
        email={user.email}
        searchTerm={search}
        setSearchTerm={setSearch}
        onLogout={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }}
      />

      {search && suggestions.length > 0 && (
        <ul className="absolute left-6 top-20 z-50 w-64 rounded-md border bg-white shadow-lg">
          {suggestions.map((item, index) => (
            <li
              key={index}
              className="cursor-pointer p-2 hover:bg-gray-100"
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
            products={filteredProducts.slice(0, 8).map(toProductCard)}
          />

          <PromoBanner />

          <MiddleBanner />

          <ProductSection
            title="More Products"
            products={filteredProducts.slice(8, 16).map(toProductCard)}
          />
        </>
      )}
    </div>
  );
}