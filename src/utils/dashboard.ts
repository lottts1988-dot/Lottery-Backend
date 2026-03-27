import type { Order } from "../../prisma/generated/prisma/client";
import { prisma } from "./prisma";

type MonthKeys =
  | "jan"
  | "feb"
  | "mar"
  | "apr"
  | "may"
  | "jun"
  | "jul"
  | "aug"
  | "sep"
  | "oct"
  | "nov"
  | "dec";

export class Dashboard {
  private readonly monthKeys: MonthKeys[] = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];

  private getMonthKey(index: number): MonthKeys {
    return this.monthKeys[index]!;
  }

  private initializeMonthCounts<T extends number | null>(defaultValue: T) {
    return Object.fromEntries(
      this.monthKeys.map((m) => [m, defaultValue]),
    ) as Record<MonthKeys, T>;
  }

  private async countByStatus(
    model: "ticket" | "order",
    year: number,
    statuses: Record<string, string>,
  ): Promise<Record<string, number>> {
    const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${year}-12-31T23:59:59.999Z`);
    const result: Record<string, number> = {};

    await Promise.all(
      Object.entries(statuses).map(async ([code, key]) => {
        let count: number;

        if (model === "ticket") {
          count = await prisma.ticket.count({
            where: {
              isDeleted: false,
              status: code,
              date: { startsWith: `${year}-` },
            },
          });
        } else {
          count = await prisma.order.count({
            where: {
              isDeleted: false,
              status: code,
              createdAt: { gte: startDate, lte: endDate },
            },
          });
        }

        result[key] = count;
      }),
    );

    return result;
  }

  public async ticketCounts(year: number) {
    const statuses = {
      "01": "open",
      "02": "confirmed",
      "03": "failed",
      "04": "pending",
    };
    return this.countByStatus("ticket", year, statuses);
  }

  public async orderCounts(year: number) {
    const statuses = { "01": "open", "02": "confirmed", "03": "failed" };
    return this.countByStatus("order", year, statuses);
  }

  public async ticketRevenuePerMonth(year: number) {
    const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

    const orders = await prisma.order.findMany({
      where: {
        status: "02",
        createdAt: { gte: startDate, lte: endDate },
        isDeleted: false,
      },
      include: {
        payment: { include: { ticket: true } },
        lottery: true,
      },
    });

    const monthlyTotals = this.initializeMonthCounts(0);

    for (const order of orders) {
      const monthKey = this.getMonthKey(order.createdAt.getUTCMonth());
      const price = Number(order.lottery?.price || 0);
      const ticketCount = order.payment?.ticket?.length || 0;

      monthlyTotals[monthKey] += price * ticketCount;
    }

    return monthlyTotals;
  }

  public async orderCountsPerMonth(year: number) {
    type MonthCounts = Record<MonthKeys, number>;
    const response: {
      all: MonthCounts;
      pending: MonthCounts;
      confirmed: MonthCounts;
      failed: MonthCounts;
    } = {
      all: this.initializeMonthCounts(0),
      pending: this.initializeMonthCounts(0),
      confirmed: this.initializeMonthCounts(0),
      failed: this.initializeMonthCounts(0),
    };

    const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

    const orders: Pick<Order, "createdAt" | "status">[] =
      await prisma.order.findMany({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          isDeleted: false,
        },
        select: { createdAt: true, status: true },
      });

    for (const order of orders) {
      const monthKey = this.getMonthKey(order.createdAt.getUTCMonth());
      response.all[monthKey] += 1;

      switch (order.status) {
        case "01":
          response.pending[monthKey] += 1;
          break;
        case "02":
          response.confirmed[monthKey] += 1;
          break;
        case "03":
          response.failed[monthKey] += 1;
          break;
      }
    }

    return response;
  }
}
