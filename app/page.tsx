"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/ui/Navbar";
import AuthForm from "@/components/ui/AuthForm";
import UsersTable from "@/components/ui/UserTable";
import { User, Product } from "@/types/types";
import { useRouter } from "next/navigation";

type Page = "dashboard" | "users";

/* =======================
   SAMPLE PRODUCTS (9)
======================= */
const sampleProducts: Product[] = [
  {
  id: 1,
  name: "Apple Watch",
  category: "Watches",
  price: "$299",
  image: "/images/apple-watch.jpg",
  description: "A premium smartwatch designed to track your health, fitness, and daily activity with precision and style."
},
{
  id: 2,
  name: "Shoes",
  category: "Footwear",
  price: "$79",
  image: "/images/shoes.jpg",
  description: "Comfort-focused footwear engineered for all-day support, durability, and modern casual style."
},
{
  id: 3,
  name: "Shirt",
  category: "Clothing",
  price: "$49",
  image: "/images/shirt.jpg",
  description: "A soft-touch cotton shirt crafted for everyday comfort with a clean and minimal design."
},
{
  id: 4,
  name: "Handbag",
  category: "Accessories",
  price: "$120",
  image: "/images/handbag.jpg",
  description: "An elegant handbag designed with premium materials, offering both style and practical storage."
},
{
  id: 5,
  name: "Perfume",
  category: "Fragrances",
  price: "$59",
  image: "/images/perfume.jpg",
  description: "A long-lasting fragrance crafted with refined notes to deliver a confident and lasting impression."
},
{
  id: 6,
  name: "Sunglasses",
  category: "Accessories",
  price: "$89",
  image: "/images/sunglassess.jpg",
  description: "Stylish UV-protected eyewear designed to reduce glare while enhancing everyday fashion."
},
{
  id: 7,
  name: "Laptop",
  category: "Electronics",
  price: "$899",
  image: "/images/laptop.jpg",
  description: "A high-performance laptop built for productivity, multitasking, and seamless computing experience."
},
{
  id: 8,
  name: "Headphones",
  category: "Electronics",
  price: "$199",
  image: "/images/headphone.jpg",
  description: "Noise-cancelling headphones delivering deep bass, clear sound, and immersive audio quality."
},
{
  id: 9,
  name: "Smartphone",
  category: "Electronics",
  price: "$699",
  image: "/images/smartphone.jpg",
  description: "A next-generation smartphone offering powerful performance, advanced camera, and smooth user experience."
},
];

/* =======================
   SAMPLE USERS
======================= */
const sampleUsers: User[] = [
  { id: 1, username: "Aastha", email: "a@example.com" },
  { id: 2, username: "Ram", email: "ram@example.com" },
  { id: 3, username: "Gita", email: "gita@example.com" },
];

export default function Home() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState<Page>("dashboard");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Watches",
    "Footwear",
    "Clothing",
    "Accessories",
    "Fragrances",
    "Electronics",
  ];

  /* =======================
     LOGIN CHECK
  ======================= */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  /* =======================
     FILTER PRODUCTS
  ======================= */
  const filteredProducts = sampleProducts.filter((p) => {
    const matchSearch = p.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchCategory =
      selectedCategory === "All" || p.category === selectedCategory;

    return matchSearch && matchCategory;
  });

  /* =======================
     LOGIN SCREEN
  ======================= */
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <AuthForm onLogin={(user) => setUser(user)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <Navbar
        email={user.email}
        onLogout={() => setUser(null)}
        onNavigate={setPage}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* =======================
          PRODUCTS
      ======================= */}
      {page === "dashboard" && (
        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">

          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow-md rounded-xl p-4 flex flex-col gap-3"
            >
              <img
                src={product.image}
                className="h-40 w-full object-cover rounded-lg"
              />

              <h3 className="font-bold">{product.name}</h3>
              <p className="text-gray-600">{product.price}</p>

              {/* PRODUCT PAGE */}
              <button
                className="bg-black text-white px-3 py-2 rounded-lg"
                onClick={() => router.push(`/product/${product.id}`)}
              >
                View Product
              </button>

              {/* CHECKOUT PAGE */}
              <button
                className="bg-green-600 text-white px-3 py-2 rounded-lg"
                onClick={() => router.push(`/checkout/${product.id}`)}
              >
                Buy Now
              </button>
            </div>
          ))}

        </div>
      )}

      {/* =======================
          USERS
      ======================= */}
      {page === "users" && (
        <UsersTable initialUsers={sampleUsers} />
      )}

    </div>
  );
}