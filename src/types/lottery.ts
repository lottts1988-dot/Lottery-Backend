interface Org {
  filename: string;
  filepath: string;
}

export interface TLottery {
  logo: string;
  title: string;
  desc: string;
  org: Org[];
  terms: string;
  price: string;
}

export interface GetLottery {
  page?: number;
  limit?: number;
  title?: string;
  desc?: string;
}

export interface LotteryFilter {
  title?: string;
  desc?: string;
}
