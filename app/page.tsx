"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/ui/Navbar";
import AuthForm from "@/components/ui/AuthForm";
import UsersTable from "@/components/ui/UserTable";
import ProductsTable from "@/components/ProductsTable";
import { User, Product } from "@/types/types";

const sampleProducts: Product[] = [
  { id: 1, name: "Apple Watch", category: "Watches", price: "$299", image: "/images/apple-watch.jpg", description: "A premium smartwatch." },
  { id: 2, name: "Shoes", category: "Footwear", price: "$79", image: "/images/shoes.jpg", description: "Comfortable shoes." },
  { id: 3, name: "Shirt", category: "Clothing", price: "$49", image: "/images/shirt.jpg", description: "Soft cotton shirt." },
  { id: 4, name: "Handbag", category: "Accessories", price: "$120", image: "/images/handbag.jpg", description: "Elegant handbag." },
  { id: 5, name: "Perfume", category: "Fragrances", price: "$59", image: "/images/perfume.jpg", description: "Long-lasting fragrance." },
  { id: 6, name: "Sunglasses", category: "Accessories", price: "$89", image: "/images/sunglassess.jpg", description: "UV-protective sunglasses." },
  { id: 7, name: "Laptop", category: "Electronics", price: "$899", image: "/images/laptop.jpg", description: "High-performance laptop." },
  { id: 8, name: "Headphones", category: "Electronics", price: "$199", image: "/images/headphone.jpg", description: "Noise-cancelling headphones." },
  { id: 9, name: "Smartphone", category: "Electronics", price: "$699", image: "/images/smartphone.jpg", description: "Latest smartphone." },
];

const sampleUsers: User[] = [
  { id: 1, username: "Aastha", email: "a@example.com" },
  { id: 2, username: "Ram", email: "ram@example.com" },
  { id: 3, username: "Gita", email: "gita@example.com" },
];

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState<"dashboard" | "products" | "users">("dashboard");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Watches", "Footwear", "Clothing", "Accessories", "Fragrances", "Electronics"];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const handleAddToCart = (product: Product, totalPrice: number) => {
    alert(`${product.name} added to cart! Total: $${totalPrice}`);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-zinc-900">
        <AuthForm
          onLogin={(data) =>
            setUser({ id: 1, username: data.email.split("@")[0], email: data.email })
          }
        />
      </div>
    );
  }

  const filteredProducts = sampleProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      {/* Navbar with search & category filter */}
      <Navbar
        email={user.email}
        onLogout={handleLogout}
        onNavigate={setPage}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Dashboard page */}
      {page === "dashboard" && (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg shadow p-4 bg-white dark:bg-zinc-800 flex flex-col items-center gap-4 cursor-pointer"
              onClick={() => {
                setSelectedProduct(product);
                setPage("products");
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-32 h-32 object-cover rounded"
              />
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
                {product.name}
              </h3>
              <p className="text-zinc-700 dark:text-zinc-300">{product.price}</p>
              <button
                className="bg-black text-white py-2 px-4 rounded hover:bg-zinc-800 shadow"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product, Number(product.price.replace("$", "")));
                }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Product detail page */}
      {page === "products" && selectedProduct && (
        <ProductsTable
          product={selectedProduct}
          onBack={() => {
            setSelectedProduct(null);
            setPage("dashboard");
          }}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Users page */}
      {page === "users" && <UsersTable initialUsers={sampleUsers} />}
    </div>
  );
}