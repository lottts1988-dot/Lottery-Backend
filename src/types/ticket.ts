export interface CreateTicket {
  alphabet: string;
  number: string;
  status: string;
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

export interface UpdateTicket {
  alphabet: string;
  number: string;
  status: string;
}
