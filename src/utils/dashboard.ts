import type { Order } from "../../prisma/generated/prisma/client";
import { prisma } from "./prisma";

export class Dashboard {
  private readonly monthKeys = [
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
  ] as const;

  private getMonthKey(index: number) {
    return this.monthKeys[index]!;
  }

  private initializeMonthCounts<T extends number | null>(defaultValue: T) {
    return Object.fromEntries(
      this.monthKeys.map((m) => [m, defaultValue]),
    ) as Record<(typeof this.monthKeys)[number], T>;
  }

  public async ticketRevenue(year: number) {
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

    orders.forEach((order) => {
      const monthIndex = order.createdAt.getUTCMonth();
      const monthKey = this.getMonthKey(monthIndex);

      const price = Number(order.lottery?.price || 0);
      const ticketCount = order.payment?.ticket?.length || 0;

      monthlyTotals[monthKey] += price * ticketCount;
    });

    return monthlyTotals;
  }

  public async orderCounts(year: number) {
    type MonthKeys = (typeof this.monthKeys)[number];
    type MonthCounts = Record<MonthKeys, number>;

    const response = {
      all: this.initializeMonthCounts(0) as MonthCounts,
      pending: this.initializeMonthCounts(0) as MonthCounts,
      confirmed: this.initializeMonthCounts(0) as MonthCounts,
      failed: this.initializeMonthCounts(0) as MonthCounts,
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

    orders.forEach((order) => {
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
    });

    return response;
  }
}
