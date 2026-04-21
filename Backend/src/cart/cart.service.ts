import { Injectable } from "@nestjs/common";

type CartItem = {
  productId: number;
  name: string;
  price: string;
  image: string;
  quantity: number;
};

let cart: CartItem[] = [];

@Injectable()
export class CartService {
  addToCart(item: Omit<CartItem, "quantity">) {
    const existing = cart.find(p => p.productId === item.productId);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    return cart;
  }

  getCart() {
    return cart;
  }

  removeFromCart(productId: number) {
    cart = cart.filter(item => item.productId !== productId);
    return cart;
  }

  clearCart() {
    cart = [];
    return cart;
  }
}