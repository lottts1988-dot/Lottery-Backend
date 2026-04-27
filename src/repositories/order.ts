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
            ticket: {
              orderBy: [{ alphabet: "asc" }, { number: "asc" }],
            },
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

    if (status == "03") {
      await prisma.ticket.updateMany({
        where: {
          id: { in: ticketls },
        },
        data: {
          status: "01",
        },
      });
    } else {
      await prisma.ticket.updateMany({
        where: {
          id: { in: ticketls },
        },
        data: {
          status,
        },
      });
    }

    const result = prisma.order.update({
      where: { id },
      data: {
        status,
      },
      include: { payment: { include: { ticket: true } } },
    });
    return result;
  }

  public async updateManyOrderStatus(ids: string[], data: UpdateOrder) {
    const { status } = data;

    const orders = await prisma.order.findMany({
      where: {
        id: { in: ids },
      },
      include: {
        payment: {
          include: {
            ticket: true,
          },
        },
      },
    });

    const ticketIds: string[] = [];

    for (const order of orders) {
      if (order?.payment?.ticket) {
        for (const ticket of order.payment.ticket) {
          ticketIds.push(ticket.id);
        }
      }
    }

    if (ticketIds.length > 0) {
      await prisma.ticket.updateMany({
        where: {
          id: { in: ticketIds },
        },
        data: {
          status: status === "03" ? "01" : status,
        },
      });
    }
    const [, result] = await prisma.$transaction([
      prisma.order.updateMany({
        where: { id: { in: ids } },
        data: { status },
      }),
      prisma.order.findMany({
        where: { id: { in: ids } },
      }),
    ]);

    return result;
  }

  public async deleteOrder(id: string) {
    const result = prisma.order.update({
      where: { id },
      data: { isDeleted: true },
    });

    return result;
  }

  public async getConfirmedOrderExport(filters: OrderFilter) {
    const { startdate, enddate } = filters;
    const where: Prisma.OrderWhereInput = {
      isDeleted: false,
      status: "02",
      createdAt: {
        ...(startdate && { gte: new Date(`${startdate}T00:00:00.000Z`) }),
        ...(enddate && { lte: new Date(`${enddate}T23:59:59.999Z`) }),
      },
    };

    const [orders] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },

        include: {
          payment: {
            include: {
              ticket: {
                orderBy: [{ alphabet: "asc" }, { number: "asc" }],
              },
            },
          },
        },
      }),

      prisma.order.count({ where }),
    ]);

    const data = orders.flatMap(
      (order) =>
        order.payment?.ticket?.map((ticket) => ({
          ...ticket,
          invoiceno: order.invoiceno,
          name: order.payment?.name,
          address: order.payment?.address,
          phone: order.payment?.phone,
        })) ?? [],
    );

    return data;
  }

  public async getConfirmedOrder(
    page: number,
    perPage: number,
    filters: OrderFilter,
  ) {
    const { startdate, enddate, alphabet, number, search } = filters;

    const cleanSearch = search?.replace(/-/g, "").trim() || "";
    const where: Prisma.OrderWhereInput = {
      isDeleted: false,
      status: "02",
      createdAt: {
        ...(startdate && { gte: new Date(`${startdate}T00:00:00.000Z`) }),
        ...(enddate && { lte: new Date(`${enddate}T23:59:59.999Z`) }),
      },
    };

    const orders = await prisma.order.findMany({
      where,
      include: {
        payment: {
          include: {
            ticket: {
              where: {
                ...(alphabet && { alphabet }),
                ...(number && { number }),
                ...(cleanSearch && {
                  OR: [
                    { alphabet: { contains: search, mode: "insensitive" } },
                    { number: { contains: search } },
                    {
                      AND: [
                        {
                          alphabet: {
                            contains: cleanSearch.replace(/[0-9]/g, ""),
                            mode: "insensitive",
                          },
                        },
                        {
                          number: {
                            contains: cleanSearch.replace(/[a-zA-Z]/g, ""),
                          },
                        },
                      ],
                    },
                  ],
                }),
              },
            },
          },
        },
      },
    });

    const flat = orders.flatMap(
      (order) =>
        order.payment?.ticket?.map((ticket) => ({
          id: ticket.id,
          alphabet: ticket.alphabet,
          number: ticket.number,
          time: ticket.time,
          date: ticket.date,
          annoucedate: ticket.annoucedate,
          status: ticket.status,
          reservedAt: ticket.reservedAt,
          createdAt: ticket.createdAt,
          updatedAt: ticket.updatedAt,
          userid: ticket.userid,

          invoiceno: order.invoiceno ?? null,
          name: order.payment?.name ?? null,
          address: order.payment?.address ?? null,
          phone: order.payment?.phone ?? null,
        })) ?? [],
    );

    flat.sort((a, b) => {
      if (a.alphabet !== b.alphabet) {
        return a.alphabet.localeCompare(b.alphabet);
      }
      return Number(a.number) - Number(b.number);
    });

    const total = flat.length;
    const start = (page - 1) * perPage;
    const end = start + perPage;

    const data = flat.slice(start, end);

    return {
      data,
      meta: {
        total,
        currentPage: page,
        perPage,
        totalPages: Math.ceil(total / perPage),
        hasNextPage: end < total,
        hasPreviousPage: page > 1,
      },
    };
  }
}
