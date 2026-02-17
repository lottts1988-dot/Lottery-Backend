import { Prisma, type Ticket } from "../../prisma/generated/prisma/client";
import type { UserJwtPayload } from "../types/jwt";
import type { CreateTicket, TicketFilter, UpdateTicket } from "../types/ticket";
import { getCurrentMonthString, getNextMonthString, getTime } from "../utils/common";
import { paginate } from "../utils/paginate";
import { prisma } from "../utils/prisma";

export class TicketRepo {
  public async createTicket(data: CreateTicket, reqUser: UserJwtPayload) {
    const { alphabet, number, status } = data;

    const date = getCurrentMonthString();
    const nextmonth = getNextMonthString();

    const userid = reqUser.id;

    const time = await getTime();

    const result = await prisma.ticket.create({
      data: {
        userid,
        alphabet,
        number,
        time,
        date,
        annoucedate: `${nextmonth}-02`,
        status,
      },
    });
    return result;
  }

  public async getCurrentMonthTicket(
    page: number,
    perPage: number,
    filters: TicketFilter,
  ) {
    const { alphabet, number } = filters;

    const currentMonth = getCurrentMonthString();

    const where: Prisma.TicketWhereInput = {
      isDeleted: false,
      date: currentMonth,
      ...(alphabet && { alphabet }),
      ...(number && { number }),
    };

    const query: Prisma.TicketFindManyArgs = { where };

    return paginate<Ticket, Prisma.TicketFindManyArgs>(
      prisma.ticket,
      query,
      { page, perPage },
      {},
      { updatedAt: "desc" },
    );
  }

  public async updateTicket(id: string, data: UpdateTicket) {
    const { alphabet, number, status } = data;

    const lastTicket = await prisma.ticket.findFirst({
      orderBy: { date: "desc" },
    });

    const lastNumber = lastTicket?.number ?? 0;

    const lastMonth = lastTicket ? lastTicket.updatedAt.getMonth() : -1;
    const currentMonth = new Date().getMonth();

    let thisMonthNumber = lastNumber;

    if (currentMonth !== lastMonth) {
      thisMonthNumber = Number(lastNumber) + 1;
    }

    const result = prisma.ticket.update({
      where: { id },
      data: {
        alphabet,
        number,
        time: String(thisMonthNumber),
        status,
      },
    });
    return result;
  }

  public async deleteTicket(id: string) {
    const result = prisma.ticket.update({
      where: { id },
      data: { isDeleted: true },
    });

    return result;
  }
}
