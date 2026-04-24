import type { OrderRepo } from "../repositories/order";
import type {
  GetOrder,
  INVFilter,
  OrderFilter,
  UpdateOrder,
} from "../types/order";

export class OrderService {
  constructor(private orderRepo: OrderRepo) {
    this.orderRepo = orderRepo;
  }

  public async getOrders(data: GetOrder) {
    const { page = 1, limit = 20 } = data;

    const filters: OrderFilter = data;

    const orders = await this.orderRepo.getOrders(
      Number(page),
      Number(limit),
      filters,
    );

    return orders;
  }

  public async getConfirmedOrderExport(data: GetOrder) {
    const filters: OrderFilter = data;

    const orders = await this.orderRepo.getConfirmedOrderExport(filters);

    return orders;
  }

  public async getConfirmedOrder(data: GetOrder) {
    const { page = 1, limit = 20 } = data;
    const filters: OrderFilter = data;

    const orders = await this.orderRepo.getConfirmedOrder(
      Number(page),
      Number(limit),
      filters,
    );

    return orders;
  }

  public async getOrderByINV(data: INVFilter) {
    const filters: INVFilter = data;
    return this.orderRepo.getOrderByINV(filters);
  }

  public async updateOrderStatus(id: string, data: UpdateOrder) {
    return this.orderRepo.updateOrderStatus(id, data);
  }

  public async deleteOrder(id: string) {
    return this.orderRepo.deleteOrder(id);
  }
}
