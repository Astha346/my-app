"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

type Product = {
  id?: string | number;
  name: string;
  price: string;
  image: string;
  description: string;
  category: string;
};

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
  const router = useRouter();

  const productId = product.id ?? product.id;

  const price = Number(String(product.price).replace(/[^0-9.]/g, ""));
  const total = price * quantity;

  
  const handleBuyNow = async () => {
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  if (!user?.id) {
    alert("Please login first");
    router.push("/login");
    return;
  }

  await api.post("/cart/add", {
    userId: user.id,
    productId,
    name: product.name,
    price,
    image: product.image,
    quantity,
  });

  router.push("/cart");
};

  return (
    <div className="p-6">

      <Button onClick={onBack}>Back</Button>

      <Card className="p-6 grid md:grid-cols-2 gap-8">

        <img
          src={product.image}
          className="h-100 object-cover w-full rounded"
          alt={product.name}
        />

        <div className="flex flex-col gap-4">

          <h1 className="text-2xl font-bold">
            {product.name}
          </h1>

          <p className="text-lg text-green-600">
            ${price}
          </p>

          <Input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />

          <p className="font-semibold">
            Total: ${total}
          </p>

          {/* ADD TO CART */}
          <Button onClick={() => onAddToCart(product, total)}>
            Add to Cart
          </Button>

          {/* BUY NOW (FIXED) */}
          <Button onClick={handleBuyNow}>
            Buy Now
          </Button>

        </div>

      </Card>
    </div>
  );
}