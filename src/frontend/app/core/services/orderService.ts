import { Order, CreateOrderDto } from "../models/Order";

export const orderService = {
  async getAll(): Promise<Order[]> {
    const res = await fetch("/api/orders");
    if (!res.ok) throw new Error("Falha ao buscar pedidos");
    
    const data: Order[] = await res.json();
    return data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getById(id: string): Promise<Order> {
    const res = await fetch(`/api/orders/${id}`);
    if (!res.ok) throw new Error("Pedido não encontrado");
    return await res.json();
  },

  async create(order: CreateOrderDto): Promise<void> {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });

    if (!res.ok) throw new Error("Falha ao criar pedido");
  }
};