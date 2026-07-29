"use client";

import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onClose: () => void;
  product: any;
}

export default function ViewProductDialog({
  open,
  onClose,
  product,
}: Props) {
  if (!open || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-2xl font-bold">
            Product Details
          </h2>

          <Button
            variant="outline"
            onClick={onClose}
          >
            ✕
          </Button>
        </div>

        {/* Body */}
        <div className="space-y-5 p-6">

          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              className="mx-auto h-52 w-52 rounded-xl object-cover"
            />
          )}

          <div>
            <h3 className="text-xl font-bold">
              {product.name}
            </h3>
          </div>

          <div>
            <strong>Category:</strong>{" "}
            {product.category}
          </div>

          <div>
            <strong>Price:</strong>{" "}
            Rs. {product.price}
          </div>

          <div>
            <strong>Description:</strong>

            <p className="mt-2 text-gray-600">
              {product.description || "No description"}
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end border-t p-6">
          <Button onClick={onClose}>
            Close
          </Button>
        </div>

      </div>
    </div>
  );
}