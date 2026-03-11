import { Prisma, type Order } from "../../prisma/generated/prisma/client";
import type { INVFilter, OrderFilter, UpdateOrder } from "../types/order";
import { paginate } from "../utils/paginate";
import { prisma } from "../utils/prisma";

export class OrderRepo {
  public async getOrders(page: number, perPage: number, filters: OrderFilter) {
    const { startdate, enddate, status, search } = filters;

    const where: Prisma.OrderWhereInput = {
      isDeleted: false,
      ...(status && {
        status: status,
      }),
      ...(search &&
        search.trim() !== "" && {
          OR: [
            { invoiceno: { contains: search, mode: "insensitive" } },
            {
              payment: {
                isDeleted: false,
                OR: [
                  {
                    name: {
                      contains: search,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  },
                  {
                    address: {
                      contains: search,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  },
                  {
                    phone: {
                      contains: search,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  },
                ],
              },
            },
          ],
        }),
      createdAt: {
        ...(startdate && { gte: new Date(`${startdate}T00:00:00.000Z`) }),
        ...(enddate && { lte: new Date(`${enddate}T23:59:59.999Z`) }),
      },
    };

    const query: Prisma.OrderFindManyArgs = { where };

    return paginate<Order, Prisma.OrderFindManyArgs>(
      prisma.order,
      query,
      { page, perPage },
      {
        payment: {
          include: {
            ticket: true,
          },
        },
        lottery: true,
      },
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

    const oneOrder = await prisma.order.findFirst({
      where: { id },
      include: { payment: { include: { ticket: true } } },
    });

    const ticketls: string[] = [];

    if (oneOrder?.payment?.ticket) {
      for (const ticket of oneOrder.payment.ticket) {
        ticketls.push(ticket.id);
      }
    }

    await prisma.ticket.updateMany({
      where: {
        id: { in: ticketls },
      },
      data: {
        status,
      },
    });

    const result = prisma.order.update({
      where: { id },
      data: {
        status,
      },
      include: { payment: { include: { ticket: true } } },
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
