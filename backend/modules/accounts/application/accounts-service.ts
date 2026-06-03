import type { AccountRepository } from './account-repository.js';
import type { AppContext } from '../../../shared/app-context.js';
import { type Result, ok } from '../../../shared/kernel/result.js';
import type { Account } from '../domain/account.js';

export class AccountsService {
  public constructor(
    private readonly ctx: AppContext,
    private readonly accountRepo: AccountRepository,
  ) {}

  public async list(institutionId?: string): Promise<Result<Account[], never>> {
    const accounts = await this.accountRepo.list(institutionId);

    return ok(accounts);
  }

  public async create(institutionId: string, name: string, currency: string): Promise<Result<Account, never>> {
    const account = await this.accountRepo.create(institutionId, name, currency);

    return ok(account);
  }
}
