import { Prisma, type Ticket } from "../../prisma/generated/prisma/client";
import type { UserJwtPayload } from "../types/jwt";
import type { TTicket, TicketFilter } from "../types/ticket";
import {
  getCurrentMonthString,
  getNextMonthString,
  getTime,
} from "../utils/common";
import { paginate } from "../utils/paginate";
import { prisma } from "../utils/prisma";

export class TicketRepo {
  public async createTicket(data: TTicket, reqUser: UserJwtPayload) {
    const { alphabet, number } = data;

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
        annoucedate: `${nextmonth}-01`,
        status: "01",
      },
    });
    return result;
  }

  public async createMultipleTicket(data: TTicket[], reqUser: UserJwtPayload) {
    const date = getCurrentMonthString();
    const nextmonth = getNextMonthString();

    const userid = reqUser.id;

    const time = await getTime();
    return prisma.$transaction(
      data.map((item) =>
        prisma.ticket.create({
          data: {
            userid,
            alphabet: item.alphabet,
            number: item.number,
            time,
            date,
            annoucedate: `${nextmonth}-01`,
            status: "01",
          },
        }),
      ),
    );
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
      status: "01",
      date: currentMonth,
      ...(alphabet && { alphabet }),
      ...(number && {
        number: {
          contains: number,
        },
      }),
    };

    const query: Prisma.TicketFindManyArgs = { where };

    return paginate<Ticket, Prisma.TicketFindManyArgs>(
      prisma.ticket,
      query,
      { page, perPage },
      {},
      { alphabet: "asc" },
    );
  }

  public async getAllTickets(
    page: number,
    perPage: number,
    filters: TicketFilter,
  ) {
    const { date, search, status } = filters;

    const where: Prisma.TicketWhereInput = {
      isDeleted: false,
      status: status,
      date: date,
      OR: [
        { alphabet: { contains: search, mode: "insensitive" } },
        { number: { contains: search, mode: "insensitive" } },
      ],
    };

    const query: Prisma.TicketFindManyArgs = { where };

    return paginate<Ticket, Prisma.TicketFindManyArgs>(
      prisma.ticket,
      query,
      { page, perPage },
      {},
      { alphabet: "asc" },
    );
  }

  public async updateTicket(id: string, data: TTicket) {
    const { alphabet, number } = data;

    const result = prisma.ticket.update({
      where: { id },
      data: {
        alphabet,
        number,
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
