import type { ResultRepo } from "../repositories/result";
import type { UserJwtPayload } from "../types/jwt";
import type { TResult } from "../types/result";

export class ResultService {
  constructor(private resultRepo: ResultRepo) {
    this.resultRepo = resultRepo;
  }

  public async createResult(data: TResult, reqUser: UserJwtPayload) {
    const createresult = await this.resultRepo.createResult(data, reqUser);
    return createresult;
  }

  public async getCurrentMonthResult() {
    const getCurrentMonthResult = await this.resultRepo.getCurrentMonthResult();
    return getCurrentMonthResult;
  }

  public async updateResult(id: string, data: TResult) {
    return this.resultRepo.updateResult(id, data);
  }

  public async deleteResult(id: string) {
    return this.resultRepo.deleteResult(id);
  }
}
