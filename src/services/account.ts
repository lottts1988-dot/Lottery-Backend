import type { AccountRepo } from "../repositories/account";
import type { UserJwtPayload } from "../types/jwt";
import type {
  TAccount,
  GetAccount,
  AccountFilter,
  GetAccountByAdmin,
  AccountFilterForAdmin,
} from "../types/account";

export class AccountService {
  constructor(private accountRepo: AccountRepo) {
    this.accountRepo = accountRepo;
  }

  public async createAccount(data: TAccount, reqUser: UserJwtPayload) {
    const createaccount = await this.accountRepo.createAccount(data, reqUser);
    return createaccount;
  }

  public async getAccounts(data: GetAccount) {
    const { page = 1, limit = 20 } = data;

    const filters: AccountFilter = data;

    const accounts = await this.accountRepo.getAccounts(
      Number(page),
      Number(limit),
      filters,
    );

    return accounts;
  }

  public async getAccountsByAdmin(data: GetAccountByAdmin) {
    const { page = 1, limit = 20 } = data;

    const filters: AccountFilterForAdmin = data;

    const accounts = await this.accountRepo.getAccountsByAdmin(
      Number(page),
      Number(limit),
      filters,
    );

    return accounts;
  }

  public async updateAccount(id: string, data: TAccount) {
    return this.accountRepo.updateAccount(id, data);
  }

  public async deleteAccount(id: string) {
    return this.accountRepo.deleteAccount(id);
  }
}
