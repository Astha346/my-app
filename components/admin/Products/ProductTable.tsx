"use client";

import { useEffect, useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";

import api from "@/lib/api";

import { Button } from "@/components/ui/button";

interface Product {
  _id: string;
  name: string;
  category: string;
  price: string;
  image?: string;
  description?: string;
}

export default function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(id: string) {
    const ok = confirm("Delete this product?");

    if (!ok) return;

    try {
      await api.delete(`/products/${id}`);

      setProducts((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (err) {
      console.error(err);
      alert("Failed to delete product.");
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center">
        Loading products...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center text-gray-500">
        No products found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-5 py-3 text-left">Image</th>
            <th className="px-5 py-3 text-left">Name</th>
            <th className="px-5 py-3 text-left">Category</th>
            <th className="px-5 py-3 text-left">Price</th>
            <th className="px-5 py-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr
              key={product._id}
              className="border-t hover:bg-gray-50"
            >
              <td className="px-5 py-4">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-200 text-xs">
                    No Image
                  </div>
                )}
              </td>

              <td className="px-5 py-4 font-medium">
                {product.name}
              </td>

              <td className="px-5 py-4">
                {product.category}
              </td>

              <td className="px-5 py-4">
                Rs. {product.price}
              </td>

              <td className="px-5 py-4">
                <div className="flex justify-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                  >
                    <Eye size={16} />
                  </Button>

                  <Button
                    size="icon"
                    variant="outline"
                  >
                    <Pencil size={16} />
                  </Button>

                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() =>
                      deleteProduct(product._id)
                    }
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}