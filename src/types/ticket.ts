export interface TTicket {
  alphabet: string;
  number: string;
}

export interface GetTicket {
  page?: number;
  limit?: number;
  search?: string;
  alphabet?: string;
  number: string;
}

export interface TicketFilter {
  date?: string;
  status?: string;
  search?: string;
  alphabet?: string;
  number?: string;
}
