export interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  parentId?: string | null;
  productCount?: number;
  status?: "active" | "inactive";
}