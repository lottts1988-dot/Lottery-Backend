// import cron from "node-cron";
// import { prisma } from "./prisma";

// export const startTicketCron = () => {
//   cron.schedule("* * * * *", async () => {
//     const timeout = new Date(Date.now() - 5 * 60 * 1000);

//     await prisma.ticket.updateMany({
//       where: {
//         status: "05",
//         reservedAt: {
//           lt: timeout,
//         },
//       },
//       data: {
//         status: "01",
//         reservedAt: null,
//       },
//     });
//   });
// };

// utils/cron.ts
import cron from "node-cron";
import { io } from "../server";
import { prisma } from "./prisma";

export const startTicketCron = () => {
  cron.schedule("* * * * *", async () => {
    const timeout = new Date(Date.now() - 5 * 60 * 1000);

    const expiredTickets = await prisma.ticket.findMany({
      where: { status: "05", reservedAt: { lt: timeout } },
      select: { id: true },
    });

    if (expiredTickets.length > 0) {
      await prisma.ticket.updateMany({
        where: { id: { in: expiredTickets.map((t) => t.id) } },
        data: { status: "01", reservedAt: null },
      });

      expiredTickets.forEach((ticket) => {
        io.emit(`ticket-expired-${ticket.id}`, { status: "01" });
      });
    }
  });
};
