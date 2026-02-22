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
  date?: string;
  status?: string;
  alphabet?: string;
  number?: string;
}
