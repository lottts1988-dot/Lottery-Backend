// import type { LotteryRepo } from "../repositories/lottery";
// import type { UserJwtPayload } from "../types/jwt";
// import type { TLottery, GetLottery, LotteryFilter } from "../types/lottery";

// export class LotteryService {
//   constructor(private lotteryRepo: LotteryRepo) {
//     this.lotteryRepo = lotteryRepo;
//   }

//   public async createLottery(data: TLottery, reqUser: UserJwtPayload) {
//     const createlottery = await this.lotteryRepo.createLottery(data, reqUser);
//     return createlottery;
//   }

//   public async getLotteries(data: GetLottery) {
//     const { page = 1, limit = 20 } = data;

//     const filters: LotteryFilter = data;

//     const lotterys = await this.lotteryRepo.getLotteries(
//       Number(page),
//       Number(limit),
//       filters,
//     );

//     return lotterys;
//   }

//   public async getSelectLottery() {
//     const lottery = await this.lotteryRepo.getSelectLottery();

//     return lottery;
//   }

//   public async updateLottery(id: string, data: TLottery) {
//     return this.lotteryRepo.updateLottery(id, data);
//   }

//   public async updateLotterySelect(id: string) {
//     return this.lotteryRepo.updateLotterySelect(id);
//   }

//   public async deleteLottery(id: string) {
//     return this.lotteryRepo.deleteLottery(id);
//   }
// }

import type { LotteryRepo } from "../repositories/lottery";
import type { UserJwtPayload } from "../types/jwt";
import type { Filter, GetLotteries, TLottery } from "../types/lottery";

export class LotteryService {
  constructor(private lotteryRepo: LotteryRepo) {
    this.lotteryRepo = lotteryRepo;
  }

  public async createLottery(data: TLottery, reqUser: UserJwtPayload) {
    const createlottery = await this.lotteryRepo.createLottery(data, reqUser);
    return createlottery;
  }

  public async getlotteries(data: GetLotteries) {
    const { page = 1, limit = 20 } = data;

    const filters: Filter = data;

    const accounts = await this.lotteryRepo.getlotteries(
      Number(page),
      Number(limit),
      filters,
    );

    return accounts;
  }
  
  public async getCurrentMonthLottery() {
    const getCurrentMonthLottery =
      await this.lotteryRepo.getCurrentMonthLottery();
    return getCurrentMonthLottery;
  }

  public async updateLottery(id: string, data: TLottery) {
    return this.lotteryRepo.updateLottery(id, data);
  }

  public async deleteLottery(id: string) {
    return this.lotteryRepo.deleteLottery(id);
  }
}
