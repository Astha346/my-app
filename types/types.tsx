
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
  averageRating?: number;
  totalReviews?: number;
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

/* Convert backend Product data into ProductCard data */
export const toProductCard = (p: Product): ProductCard => ({
  id: p._id,
  name: p.name,
  price: p.price,
  image: p.image,
  averageRating: 0,
  totalReviews: 0,
});
