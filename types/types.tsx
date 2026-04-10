export type User = {
    id: number;
    username: string;
    email: string;
    role?: "admin" | "user";
};

export type Product = {
    id: number;
    name: string;
    price: string;
    image: string;
    description: string;
    category: string;
};
