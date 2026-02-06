export type OrderStatus = "Pending" | "Processing" | "Completed";

export type Order = {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: OrderStatus;
  createdAt: string;
};

export type CreateOrderDto = {
  customer: string;
  product: string;
  amount: number;
};