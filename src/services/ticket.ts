import type { TicketRepo } from "../repositories/ticket";
import type { UserJwtPayload } from "../types/jwt";
import type { TTicket, GetTicket, TicketFilter } from "../types/ticket";
import { prisma } from "../utils/prisma";

export class TicketService {
  constructor(private ticketRepo: TicketRepo) {
    this.ticketRepo = ticketRepo;
  }

  public async createTicket(data: TTicket, reqUser: UserJwtPayload) {
    const createticket = await this.ticketRepo.createTicket(data, reqUser);
    return createticket;
  }

  public async createMultipleTicket(data: TTicket[], reqUser: UserJwtPayload) {
    const createMultipleTicket = await this.ticketRepo.createMultipleTicket(
      data,
      reqUser,
    );
    return createMultipleTicket;
  }

  public async getCurrentMonthTicket(data: GetTicket) {
    const { page = 1, limit = 20 } = data;

    const filters: TicketFilter = data;

    const tickets = await this.ticketRepo.getCurrentMonthTicket(
      Number(page),
      Number(limit),
      filters,
    );

    return tickets;
  }

  public async getAllTickets(data: GetTicket) {
    const { page = 1, limit = 20 } = data;

    const filters: TicketFilter = data;

    const tickets = await this.ticketRepo.getAllTickets(
      Number(page),
      Number(limit),
      filters,
    );

    return tickets;
  }

  public async updateTicket(id: string, data: TTicket) {
    return this.ticketRepo.updateTicket(id, data);
  }

  public async deleteTicket(id: string) {
    return this.ticketRepo.deleteTicket(id);
  }

  public async reserveTickets(ticketIds: string[]) {
    return prisma.$transaction(async (tx) => {
      const result = await tx.ticket.updateMany({
        where: {
          id: { in: ticketIds },
          status: "01",
        },
        data: {
          status: "05",
          reservedAt: new Date(),
        },
      });

      if (result.count !== ticketIds.length) {
        throw new Error("Some tickets already reserved");
      }

      return {};
    });
  }

  public async unreserveTickets(ticketIds: string[]) {
    return prisma.$transaction(async (tx) => {
      await tx.ticket.updateMany({
        where: {
          id: { in: ticketIds },
          status: "05",
        },
        data: {
          status: "01",
          reservedAt: new Date(),
        },
      });

      return {};
    });
  }
}
