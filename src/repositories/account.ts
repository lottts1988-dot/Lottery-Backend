import { Prisma, type Account } from "../../prisma/generated/prisma/client";
import type { UserJwtPayload } from "../types/jwt";
import type { TAccount, AccountFilter } from "../types/account";
import { paginate } from "../utils/paginate";
import { prisma } from "../utils/prisma";

export class AccountRepo {
  public async createAccount(data: TAccount, reqUser: UserJwtPayload) {
    const { name, phone, cardid } = data;

    const userid = reqUser.id;

    const result = await prisma.account.create({
      data: {
        userid,
        name,
        phone,
        cardid,
      },
      include: { card: true },
    });
    return result;
  }

  public async getAccounts(
    page: number,
    perPage: number,
    filters: AccountFilter,
  ) {
    const { name, phone } = filters;

    const where: Prisma.AccountWhereInput = {
      isDeleted: false,
      ...(name && {
        name: {
          contains: name,
          mode: "insensitive",
        },
      }),
      ...(phone && {
        phone: {
          contains: phone,
        },
      }),
    };

    const query: Prisma.AccountFindManyArgs = { where };

    return paginate<Account, Prisma.AccountFindManyArgs>(
      prisma.account,
      query,
      { page, perPage },
      { card: true },
      { updatedAt: "desc" },
    );
  }
  

  public async updateAccount(id: string, data: TAccount) {
    const { name, phone, cardid } = data;

    const result = prisma.account.update({
      where: { id },
      data: {
        name,
        phone,
        cardid,
      },
      include: { card: true },
    });
    return result;
  }

  public async deleteAccount(id: string) {
    const result = prisma.account.update({
      where: { id },
      data: { isDeleted: true },
    });

    return result;
  }
}
