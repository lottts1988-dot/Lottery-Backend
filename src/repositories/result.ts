import type { UserJwtPayload } from "../types/jwt";
import type { TResult } from "../types/result";
import { getCurrentMonthString } from "../utils/common";
import { prisma } from "../utils/prisma";

export class ResultRepo {
  public async createResult(data: TResult, reqUser: UserJwtPayload) {
    const { image } = data;

    const userid = reqUser.id;

    const date = getCurrentMonthString();

    const result = await prisma.result.create({
      data: {
        userid,
        date,
        image,
      },
    });
    return result;
  }

  public async getCurrentMonthResult() {
    const date = getCurrentMonthString();
    const result = await prisma.result.findFirst({
      where: {
        isDeleted: false,
        date,
      },
    });
    return result;
  }

  public async updateResult(id: string, data: TResult) {
    const { image } = data;

    const result = prisma.result.update({
      where: { id },
      data: {
        image,
      },
    });
    return result;
  }

  public async deleteResult(id: string) {
    const result = prisma.result.update({
      where: { id },
      data: { isDeleted: true },
    });

    return result;
  }
}
