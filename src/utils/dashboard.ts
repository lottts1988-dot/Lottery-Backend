import { prisma } from "./prisma";

export class Dashboard {
  public async ticketRevenue() {
    const result = await prisma.$queryRaw<{ total: number }[]>`
SELECT SUM(l.price * tc.ticket_count) AS total
FROM "Order" o
JOIN "Lottery" l ON l.id = o."lotteryid"
JOIN (
  SELECT o2.id, COUNT(t.id) AS ticket_count
  FROM "Order" o2
  JOIN "Ticket" t ON t."userid" = o2."userid"
  GROUP BY o2.id
) tc ON tc.id = o.id
`;

    console.log(result);
    return result;
  }
}
