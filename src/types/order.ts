export interface GetOrder {
  page?: number;
  limit?: number;
  status: string;
  search: string;
  startdate: string;
  enddate: string;
}

export interface OrderFilter {
  status: string;
  search: string;
  startdate: string;
  enddate: string;
  alphabet?: string;
  number?: string;
}

export interface INVFilter {
  invoiceno: string;
}

export interface UpdateOrder {
  status: string;
}
