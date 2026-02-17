import type { LotteryRepo } from "../repositories/lottery";
import type { UserJwtPayload } from "../types/jwt";
import type { TLottery, GetLottery, LotteryFilter } from "../types/lottery";

export class LotteryService {
  constructor(private lotteryRepo: LotteryRepo) {
    this.lotteryRepo = lotteryRepo;
  }

  public async createLottery(data: TLottery, reqUser: UserJwtPayload) {
    const createlottery = await this.lotteryRepo.createLottery(data, reqUser);
    return createlottery;
  }

  public async getLotterys(data: GetLottery) {
    const { page = 1, limit = 20 } = data;

    const filters: LotteryFilter = data;

    const lotterys = await this.lotteryRepo.getLotterys(
      Number(page),
      Number(limit),
      filters,
    );

    return lotterys;
  }

  public async updateLottery(id: string, data: TLottery) {
    return this.lotteryRepo.updateLottery(id, data);
  }

  public async deleteLottery(id: string) {
    return this.lotteryRepo.deleteLottery(id);
  }
}
