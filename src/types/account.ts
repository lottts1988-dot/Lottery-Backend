export interface TAccount {
  phone: string;
  name: string;
  cardid: string;
  t1?: string;
}

export interface GetAccount {
  page?: number;
  limit?: number;
  name?: string;
  phone?: string;
}

export interface GetAccountByAdmin {
  page?: number;
  limit?: number;
  search?: string;
}

export interface AccountFilter {
  name?: string;
  phone?: string;
}

export interface AccountFilterForAdmin {
  search?: string;
}
