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
    const { startdate, enddate, search } = filters;

    // -----------------------------
    // 1. Ticket WHERE (SOURCE OF TRUTH)
    // -----------------------------
    const where: Prisma.TicketWhereInput = {
      isDeleted: false,
      status: "02",

      ...(startdate || enddate
        ? {
            createdAt: {
              ...(startdate && { gte: new Date(`${startdate}T00:00:00.000Z`) }),
              ...(enddate && { lte: new Date(`${enddate}T23:59:59.999Z`) }),
            },
          }
        : {}),

      ...(search && search.trim() !== ""
        ? {
            OR: [
              {
                number: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                alphabet: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
    };

    // -----------------------------
    // 2. PAGINATE TICKETS (FAST)
    // -----------------------------
    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: [
          { alphabet: "asc" },
          { number: "asc" },
          { createdAt: "desc" },
        ],
      }),

      prisma.ticket.count({ where }),
    ]);

    // -----------------------------
    // 3. NO RELATIONS → MANUAL JOIN
    // -----------------------------
    const paymentIds = [...new Set(tickets.map((t) => t.id).filter(Boolean))];

    const payments = await prisma.payment.findMany({
      where: {
        id: { in: paymentIds },
        isDeleted: false,
      },
    });

    const paymentMap = new Map(payments.map((p) => [p.id, p]));

    const orderIds = [...new Set(payments.map((p) => p.id).filter(Boolean))];

    const orders = await prisma.order.findMany({
      where: {
        id: { in: orderIds },
        isDeleted: false,
      },
    });

    const orderMap = new Map(orders.map((o) => [o.id, o]));

    // -----------------------------
    // 4. MERGE RESULT (FINAL OUTPUT)
    // -----------------------------
    const data = tickets.map((ticket) => {
      const payment = paymentMap.get(ticket.id);
      const order = payment ? orderMap.get(payment.id) : null;

      return {
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

        // enriched fields
        invoiceno: order?.invoiceno ?? null,
        name: payment?.name ?? null,
        address: payment?.address ?? null,
        phone: payment?.phone ?? null,
      };
    });

    // -----------------------------
    // 5. META (CORRECT)
    // -----------------------------
    const totalPages = Math.ceil(total / perPage);

    return {
      data,
      meta: {
        total,
        currentPage: page,
        perPage,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }
}
