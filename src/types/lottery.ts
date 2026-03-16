// interface Org {
//   filename: string;
//   filepath: string;
// }

// export interface TLottery {
//   logo: string;
//   title: string;
//   desc: string;
//   org: Org[];
//   terms: string;
//   price: string;
// }

// export interface GetLottery {
//   page?: number;
//   limit?: number;
//   title?: string;
//   desc?: string;
// }

// export interface LotteryFilter {
//   title?: string;
//   desc?: string;
// }

export interface TLottery {
  image: string;
  price: string;
}

export interface GetLotteries {
  page?: number;
  limit?: number;
  search?: string;
}


export interface Filter {
  search?: string;
}

