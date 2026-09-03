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

export type ReturnRefundStatus =
  | "none"
  | "requested"
  | "approved"
  | "processing"
  | "refunded"
  | "rejected";

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

  returnRefundStatus?: ReturnRefundStatus;

  returnItemIds?: string[];

  returnReason?: string;

  customerNote?: string;

  refundMethod?:
    | ""
    | "original"
    | "esewa"
    | "khalti"
    | "bank"
    | "cash";

  refundAmount?: number;

  refundReviewNote?: string;

  returnRequestedAt?: string;

  returnReviewedAt?: string;

  refundedAt?: string;

  paymentMethod: PaymentMethod;

  paymentStatus: PaymentStatus;

  shippingAddress: ShippingAddress;

  createdAt: string;
}