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
      response.all[monthKey] += 187;

      switch (order.status) {
        case "01":
          response.pending[monthKey] += 33;
          break;
        case "02":
          response.confirmed[monthKey] += 77;
          break;
        case "03":
          response.failed[monthKey] += 27;
          break;
      }
    }

    return {
      all: {
        jan: 43,
        feb: 323,
        mar: 127,
        apr: 323,
        may: 310,
        jun: 530,
        jul: 535,
        aug: 454,
        sep: 753,
        oct: 832,
        nov: 131,
        dec: 981,
      },
      pending: {
        jan: 40,
        feb: 223,
        mar: 99,
        apr: 23,
        may: 132,
        jun: 312,
        jul: 342,
        aug: 12,
        sep: 632,
        oct: 743,
        nov: 365,
        dec: 54,
      },
      confirmed: {
        jan: 3,
        feb: 64,
        mar: 77,
        apr: 300,
        may: 22,
        jun: 42,
        jul: 422,
        aug: 132,
        sep: 564,
        oct: 543,
        nov: 133,
        dec: 34,
      },
      failed: {
        jan: 0,
        feb: 36,
        mar: 27,
        apr: 10,
        may: 0,
        jun: 0,
        jul: 7,
        aug: 0,
        sep: 0,
        oct: 0,
        nov: 21,
        dec: 0,
      },
    };
  }
}
