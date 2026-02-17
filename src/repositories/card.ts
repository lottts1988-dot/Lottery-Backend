import { Prisma, type Card } from "../../prisma/generated/prisma/client";
import type { UserJwtPayload } from "../types/jwt";
import type { TCard, CardFilter } from "../types/card";
import { paginate } from "../utils/paginate";
import { prisma } from "../utils/prisma";

export class CardRepo {
  public async createCard(data: TCard, reqUser: UserJwtPayload) {
    const { icon, name } = data;

    const userid = reqUser.id;

    const result = await prisma.card.create({
      data: {
        userid,
        icon,
        name,
      },
    });
    return result;
  }

  public async getCards(page: number, perPage: number, filters: CardFilter) {
    const { name } = filters;

    const where: Prisma.CardWhereInput = {
      isDeleted: false,
      ...(name && {
        name: {
          contains: name,
          mode: "insensitive",
        },
      }),
    };

    const query: Prisma.CardFindManyArgs = { where };

    return paginate<Card, Prisma.CardFindManyArgs>(
      prisma.card,
      query,
      { page, perPage },
      {},
      { updatedAt: "desc" },
    );
  }

  public async updateCard(id: string, data: TCard) {
    const { icon, name } = data;

    const result = prisma.card.update({
      where: { id },
      data: {
        icon,
        name,
      },
    });
    return result;
  }

  public async deleteCard(id: string) {
    const result = prisma.card.update({
      where: { id },
      data: { isDeleted: true },
    });

    return result;
  }
}
