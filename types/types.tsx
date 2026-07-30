export type Product = {
  _id: string;
  name: string;
  category: string;
  price: string;
  image: string;
  description: string;
  stock: number;
};

export type ProductCard = {
  id: string;
  name: string;
  price: string;
  image: string;
};

export type User = {
  id: string;
  username: string;
  email: string;
  role: "admin" | "customer";
};

export type Category = {
  label: string;
  value: string;
};

/* mapper */
export const toProductCard = (p: Product): ProductCard => ({
  id: p._id,
  name: p.name,
  price: p.price,
  image: p.image,
});