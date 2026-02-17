import type { CardRepo } from "../repositories/card";
import type { UserJwtPayload } from "../types/jwt";
import type { TCard, GetCard, CardFilter } from "../types/card";

export class CardService {
  constructor(private cardRepo: CardRepo) {
    this.cardRepo = cardRepo;
  }

  public async createCard(data: TCard, reqUser: UserJwtPayload) {
    const createcard = await this.cardRepo.createCard(data, reqUser);
    return createcard;
  }

  public async getCards(data: GetCard) {
    const { page = 1, limit = 20 } = data;

    const filters: CardFilter = data;

    const cards = await this.cardRepo.getCards(
      Number(page),
      Number(limit),
      filters,
    );

    return cards;
  }

  public async updateCard(id: string, data: TCard) {
    return this.cardRepo.updateCard(id, data);
  }

  public async deleteCard(id: string) {
    return this.cardRepo.deleteCard(id);
  }
}
