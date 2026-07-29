"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product: any;
}

export default function EditProductDialog({
  open,
  onClose,
  onSuccess,
  product,
}: Props) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setCategory(product.category || "");
      setPrice(product.price || "");
      setImage(product.image || "");
      setDescription(product.description || "");
    }
  }, [product]);

  if (!open || !product) return null;

  async function handleUpdate() {
    try {
      setLoading(true);

      await api.patch(`/products/${product._id}`, {
        name,
        category,
        price,
        image,
        description,
      });

      alert("Product updated successfully!");

      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to update product");
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
            <h2 className="text-2xl font-bold">Edit Product</h2>
            <p className="text-sm text-gray-500">
              Update product information
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
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Category
            </label>

            <Input
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
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Image URL
            </label>

            <Input
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Description
            </label>

            <textarea
              className="min-h-32 w-full rounded-md border p-3"
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
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Product"}
          </Button>
        </div>

      </div>
    </div>
  );
}