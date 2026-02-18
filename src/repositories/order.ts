import { Prisma, type Order } from "../../prisma/generated/prisma/client";
import type { INVFilter, OrderFilter, UpdateOrder } from "../types/order";
import { paginate } from "../utils/paginate";
import { prisma } from "../utils/prisma";

export class OrderRepo {
  public async getOrders(page: number, perPage: number, filters: OrderFilter) {
    const { startdate, enddate, status } = filters;

    const where: Prisma.OrderWhereInput = {
      isDeleted: false,
      status,
      createdAt: {
        ...(startdate && { gte: startdate }),
        ...(enddate && { lte: enddate }),
      },
    };

    const query: Prisma.OrderFindManyArgs = { where };

    return paginate<Order, Prisma.OrderFindManyArgs>(
      prisma.order,
      query,
      { page, perPage },
      {},
      { createdAt: "desc" },
    );
  }

  public async getOrderByINV(filters: INVFilter) {
    const { invoiceno } = filters;

    const result = await prisma.order.findFirst({
      where: {
        isDeleted: false,
        invoiceno,
      },
      include: {
        payment: {
          include: {
            ticket: true,
          },
        },
        lottery: true,
      },
    });
    return result;
  }

  public async updateOrderStatus(id: string, data: UpdateOrder) {
    const { status } = data;

    const result = prisma.order.update({
      where: { id },
      data: {
        status,
      },
    });
    return result;
  }

  public async deleteOrder(id: string) {
    const result = prisma.order.update({
      where: { id },
      data: { isDeleted: true },
    });

    return result;
  }
}
