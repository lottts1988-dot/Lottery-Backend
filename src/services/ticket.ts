import type { TicketRepo } from "../repositories/ticket";
import type { UserJwtPayload } from "../types/jwt";
import type { TTicket, GetTicket, TicketFilter } from "../types/ticket";

export class TicketService {
  constructor(private ticketRepo: TicketRepo) {
    this.ticketRepo = ticketRepo;
  }

  public async createTicket(data: TTicket, reqUser: UserJwtPayload) {
    const createticket = await this.ticketRepo.createTicket(data, reqUser);
    return createticket;
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

  public async updateTicket(id: string, data: TTicket) {
    return this.ticketRepo.updateTicket(id, data);
  }

  public async deleteTicket(id: string) {
    return this.ticketRepo.deleteTicket(id);
  }
}
