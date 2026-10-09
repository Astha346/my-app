"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import api from "@/lib/api";

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
const [authChecking, setAuthChecking] = useState(true);

const [search, setSearch] = useState("");
const [suggestions, setSuggestions] = useState<string[]>([]);
const [selectedCategory, setSelectedCategory] = useState("all");

// RESTORE LOGIN
useEffect(() => {
const token = localStorage.getItem("token");


if (!token) {
  setUser(null);
  setAuthChecking(false);
  setLoading(false);
  return;
}

try {
  const cleanToken = token.replace(/^['"]|['"]$/g, "");
  const decoded: any = jwtDecode(cleanToken);

  // Check whether the saved token has expired.
  if (decoded.exp && decoded.exp * 1000 <= Date.now()) {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    setUser(null);
    setLoading(false);
    return;
  }

  setUser({
    id: decoded.id,
    username: decoded.username,
    email: decoded.email,
    role: decoded.role,
  });
} catch (error) {
  console.error("Invalid token:", error);

  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");

  setUser(null);
  setLoading(false);
} finally {
  setAuthChecking(false);
}


}, []);

// FETCH PRODUCTS
useEffect(() => {
async function fetchProducts() {
try {
setLoading(true);


    const res = await api.get("/products?page=1&limit=100");

    console.log("========== PRODUCTS ==========");
    console.log("FULL RESPONSE:", res.data);
    console.log("PRODUCTS:", res.data?.products);
    console.log("PRODUCT COUNT:", res.data?.products?.length);
    console.log("==============================");

    setProducts(
      Array.isArray(res.data?.products)
        ? res.data.products
        : []
    );
  } catch (error) {
    console.error("Failed to fetch products:", error);
    setProducts([]);
  } finally {
    setLoading(false);
  }
}

fetchProducts();


}, []);

// SEARCH SUGGESTIONS
useEffect(() => {
const searchText = search.trim().toLowerCase();


if (!searchText) {
  setSuggestions([]);
  return;
}

const result = products
  .filter((product) =>
    product.name.toLowerCase().includes(searchText)
  )
  .map((product) => product.name)
  .filter(
    (name, index, self) =>
      self.indexOf(name) === index
  )
  .slice(0, 6);

setSuggestions(result);


}, [search, products]);

// FILTER PRODUCTS
const filteredProducts = products.filter((product) => {
const searchMatch = product.name
.toLowerCase()
.includes(search.toLowerCase());

const categoryMatch =
  selectedCategory === "all" ||
  product.category === selectedCategory;

return searchMatch && categoryMatch;


});

// WAIT UNTIL LOGIN STATUS IS CHECKED
if (authChecking) {
return ( <div className="flex min-h-screen items-center justify-center bg-background text-lg font-semibold text-foreground">
Checking login... </div>
);
}

// NOT LOGGED IN
if (!user) {
return (
<AuthForm
onLogin={(loggedUser) => {
setUser(loggedUser);
}}
/>
);
}

// LOADING
if (loading) {
return ( <div className="flex min-h-screen items-center justify-center bg-background text-lg font-semibold text-foreground">
Loading... </div>
);
}

// HOME PAGE
return ( <div className="relative min-h-screen bg-background text-foreground transition-colors duration-200">
<Navbar
email={user.email}
searchTerm={search}
setSearchTerm={setSearch}
suggestions={suggestions}
onLogout={() => {
localStorage.removeItem("token");
localStorage.removeItem("refresh_token");
localStorage.removeItem("user");

      setUser(null);
    }}
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
        products={filteredProducts
          .slice(0, 8)
          .map(toProductCard)}
      />

      <PromoBanner />

      <MiddleBanner />

      <ProductSection
        title="More Products"
        products={filteredProducts
          .slice(8, 16)
          .map(toProductCard)}
      />
    </>
  )}
</div>


);
}
