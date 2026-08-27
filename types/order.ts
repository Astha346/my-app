export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod =
  | "cod"
  | "esewa"
  | "khalti";

export type PaymentStatus =
  | "paid"
  | "pending"
  | "failed";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Customer {
  name: string;
  email: string;
  phone?: string;
}

export interface ShippingAddress {
  address: string;
  city: string;
  country: string;
}

export interface Order {
  _id: string;
  orderNumber: string;

  customer: Customer;

  items: OrderItem[];

  subtotal: number;
  shipping: number;
  discount: number;
  total: number;

  status: OrderStatus;

  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;

  shippingAddress: ShippingAddress;

  createdAt: string;
}