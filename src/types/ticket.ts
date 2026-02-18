export interface TTicket {
  alphabet: string;
  number: string;
}

export interface GetTicket {
  page?: number;
  limit?: number;
  alphabet?: string;
  number: string;
}

export interface TicketFilter {
  alphabet?: string;
  number?: string;
}
