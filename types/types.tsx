export type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
  thumbnail: string;
};

export type ProductCard = {
  id: number;
  name: string;
  price: string;
  image: string;
};

export type User = {
  _id: string;
  username: string;
  email: string;
  role:  "admin" | "customer";
};

export type Category = {
  label: string;
  value: string;
};

/* mapper */
export const toProductCard = (p: Product): ProductCard => ({
  id: p.id,
  name: p.title,
  price: `$${p.price}`,
  image: p.thumbnail,
});