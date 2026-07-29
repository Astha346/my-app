"use client";

import { useState } from "react";
import api from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AddProductDialog({
  open,
  onClose,
}: Props) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleSubmit() {
    try {
      setLoading(true);

      await api.post("/products", {
        name,
        category,
        price,
        image,
        description,
      });

      alert("Product added successfully!");

      setName("");
      setCategory("");
      setPrice("");
      setImage("");
      setDescription("");

      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to add product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b p-6">
          <div>
            <h2 className="text-2xl font-bold">Add Product</h2>
            <p className="text-sm text-gray-500">
              Create a new product
            </p>
          </div>

          <Button
            variant="outline"
            onClick={onClose}
          >
            ✕
          </Button>
        </div>

        {/* Body */}
        <div className="space-y-5 p-6">

          <div>
            <label className="mb-2 block font-medium">
              Product Name
            </label>

            <Input
              placeholder="iPhone 16"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Category
            </label>

            <Input
              placeholder="Mobile"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Price
            </label>

            <Input
              type="number"
              placeholder="120000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Image URL
            </label>

            <Input
              placeholder="https://..."
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Description
            </label>

            <textarea
              className="min-h-[120px] w-full rounded-md border p-3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t p-6">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Product"}
          </Button>
        </div>

      </div>
    </div>
  );
}