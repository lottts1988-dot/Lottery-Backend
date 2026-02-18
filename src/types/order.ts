export interface GetOrder {
  page?: number;
  limit?: number;
  status: string;
  startdate: string;
  enddate: string;
}

export interface OrderFilter {
  status: string;
  startdate: string;
  enddate: string;
}

export interface INVFilter {
  invoiceno: string;
}

export interface UpdateOrder {
  status: string;
}
