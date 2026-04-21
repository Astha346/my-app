export type User = {
  id?: number;
  _id?: string;
  username: string;
  email: string;
  role?: "admin" | "user";
};

export type Product = {
  id?: number;
  _id?: string;
  name: string;
  price: string;
  image: string;
  description: string;
  category: string;
};