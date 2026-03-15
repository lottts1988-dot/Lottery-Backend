// import { Prisma, type Lottery } from "../../prisma/generated/prisma/client";
// import type { UserJwtPayload } from "../types/jwt";
// import type { TLottery, LotteryFilter } from "../types/lottery";
// import { paginate } from "../utils/paginate";
// import { prisma } from "../utils/prisma";

// export class LotteryRepo {
//   public async createLottery(data: TLottery, reqUser: UserJwtPayload) {
//     const { logo, title, desc, org, terms, price } = data;

//     const userid = reqUser.id;

//     const lottery = await prisma.lottery.create({
//       data: {
//         userid,
//         logo,
//         title,
//         desc,
//         org: org as unknown as Prisma.InputJsonValue[],
//         terms,
//         price,
//         isSelect: false,
//       },
//     });
//     return lottery;
//   }

//   public async getLotteries(
//     page: number,
//     perPage: number,
//     filters: LotteryFilter,
//   ) {
//     const { title, desc } = filters;

//     const where: Prisma.LotteryWhereInput = {
//       isDeleted: false,
//       ...(title && {
//         title: {
//           contains: title,
//           mode: "insensitive",
//         },
//       }),
//       ...(desc && {
//         desc: {
//           contains: desc,
//         },
//       }),
//     };

//     const query: Prisma.LotteryFindManyArgs = { where };

//     return paginate<Lottery, Prisma.LotteryFindManyArgs>(
//       prisma.lottery,
//       query,
//       { page, perPage },
//       {},
//       { createdAt: "desc" },
//     );
//   }

//   public async getSelectLottery() {
//     const lottery = await prisma.lottery.findFirst({
//       where: {
//         isDeleted: false,
//         isSelect: true,
//       },
//     });

//     return lottery;
//   }

//   public async updateLottery(id: string, data: TLottery) {
//     const { logo, title, desc, org, terms, price } = data;

//     const lottery = prisma.lottery.update({
//       where: { id },
//       data: {
//         logo,
//         title,
//         desc,
//         org: org as unknown as Prisma.InputJsonValue[],
//         terms,
//         price,
//       },
//     });
//     return lottery;
//   }

//   public async updateLotterySelect(id: string) {
//     const lottery = await prisma.$transaction(async (tx) => {
//       await tx.lottery.updateMany({
//         where: { isSelect: true },
//         data: { isSelect: false },
//       });

//       return tx.lottery.update({
//         where: { id },
//         data: { isSelect: true },
//       });
//     });
//     return lottery;
//   }

//   public async deleteLottery(id: string) {
//     const lottery = prisma.lottery.update({
//       where: { id },
//       data: { isDeleted: true },
//     });

//     return lottery;
//   }
// }

import type { UserJwtPayload } from "../types/jwt";
import type { TLottery } from "../types/lottery";
import { getCurrentMonthString } from "../utils/common";
import { prisma } from "../utils/prisma";

export class LotteryRepo {
  public async createLottery(data: TLottery, reqUser: UserJwtPayload) {
    const { image, price } = data;

    const userid = reqUser.id;

    const date = getCurrentMonthString();

    const lottery = await prisma.lottery.create({
      data: {
        userid,
        date,
        image,
        price,
      },
    });
    return lottery;
  }

  public async getCurrentMonthLottery() {
    const date = getCurrentMonthString();
    const lottery = await prisma.lottery.findFirst({
      where: {
        isDeleted: false,
        date,
      },
    });
    console.log(lottery);
    return lottery;
  }

  public async updateLottery(id: string, data: TLottery) {
    const { image, price } = data;

    const lottery = prisma.lottery.update({
      where: { id },
      data: {
        image,
        price,
      },
    });
    return lottery;
  }

  public async deleteLottery(id: string) {
    const lottery = prisma.lottery.update({
      where: { id },
      data: { isDeleted: true },
    });

    return lottery;
  }
}
