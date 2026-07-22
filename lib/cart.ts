export type CartItem = {
  id: number;
  name: string;
  price: string;
  image: string;
  quantity: number;
};

const CART_KEY = "cart";

/* GET CART */
export const getCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
};

/* ADD TO CART */
export const addToCart = (product: any) => {
  const cart = getCart();

  const existing = cart.find((item) => item.id === product._id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));

  // 🔥 THIS FIXES YOUR ISSUE
  window.dispatchEvent(new Event("cartUpdated"));
};

/* REMOVE */
export const removeFromCart = (id: number) => {
  const cart = getCart().filter((item) => item.id !== id);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));

  window.dispatchEvent(new Event("cartUpdated"));
};

/* UPDATE */
export const updateQuantity = (id: number, qty: number) => {
  const cart = getCart();

  const updated = cart
    .map((item) =>
      item.id === id ? { ...item, quantity: qty } : item
    )
    .filter((item) => item.quantity > 0);

  localStorage.setItem(CART_KEY, JSON.stringify(updated));

  window.dispatchEvent(new Event("cartUpdated"));
};

/* CLEAR */
export const clearCart = () => {
  localStorage.removeItem(CART_KEY);

  window.dispatchEvent(new Event("cartUpdated"));
};