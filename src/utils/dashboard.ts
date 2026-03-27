import { prisma } from "./prisma";

export class Dashboard {
  public async ticketRevenue(year: number) {
    const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

    const data = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
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

    const monthKeys = [
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

    type MonthKey = (typeof monthKeys)[number];

    const monthlyTotals: Record<MonthKey, number> = Object.fromEntries(
      monthKeys.map((m) => [m, 0]),
    ) as Record<MonthKey, number>;

    data.forEach((item) => {
      const date = new Date(item.createdAt);

      const monthIndex = date.getUTCMonth() as
        | 0
        | 1
        | 2
        | 3
        | 4
        | 5
        | 6
        | 7
        | 8
        | 9
        | 10
        | 11;

      const price = Number(item.lottery?.price || 0);
      const ticketCount = item.payment?.ticket?.length || 0;

      const total = price * ticketCount;

      const monthKey = monthKeys[monthIndex];
      monthlyTotals[monthKey] += total;
    });

    const result = monthlyTotals;

    return result;
  }
}
