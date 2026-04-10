"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/types";

export default function ProductsTable({
  product,
  onBack,
  onAddToCart,
}: {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, totalPrice: number) => void;
}) {
  const [quantity, setQuantity] = useState(1);

  const priceNumber = parseFloat(product.price.replace("$", ""));

  return (
    <div className="p-6">
      <Button onClick={onBack} className="mb-4">
        Back
      </Button>

      <div className="flex gap-6 bg-white dark:bg-zinc-800 p-6 rounded shadow">
        <img
          src={product.image}
          alt={product.name}
          className="w-64 h-64 object-cover rounded"
        />

        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-lg">{product.price}</p>
          <p>{product.description}</p>

          <div className="flex items-center gap-2">
            <label>Quantity:</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-16 px-2 py-1 border rounded"
            />
          </div>

          <Button
            className="bg-black text-white"
            onClick={() => onAddToCart(product, priceNumber * quantity)}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}