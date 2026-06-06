import type { AppContext } from '../../../shared/app-context.js';
import { AppError, type Result, err, ok } from '../../../shared/kernel/result.js';
import type { Account } from '../domain/account.js';
import type { AccountRepository } from './account-repository.js';

export class AccountsService {
  public constructor(
    private readonly ctx: AppContext,
    private readonly repo: AccountRepository,
  ) {}

  public async list(): Promise<Result<Account[], never>> {
    const session = this.ctx.getSession();

    if (!session) {
      return ok([]);
    }

    return ok(await this.repo.findAll());
  }

  public async create(
    institutionName: string,
    nickname: string,
    currency: string,
  ): Promise<Result<Account, AppError>> {
    try {
      const session = this.ctx.requireSession();
      const db = this.ctx.getUserClient();
      const profile = await db.userProfile.findFirst();

      if (!profile) {
        return err(new AppError('PROFILE_NOT_FOUND', 'User profile not found'));
      }

      const account = await this.repo.create({
        institutionName,
        nickname,
        currency,
        userProfileId: profile.id,
      });

      return ok(account);
    } catch (e) {
      return err(
        new AppError(
          'CREATE_ACCOUNT_FAILED',
          e instanceof Error ? e.message : 'Unknown error',
        ),
      );
    }
  }

  public async update(
    id: string,
    data: Partial<Omit<Account, 'id' | 'userProfileId'>>,
  ): Promise<Result<Account, AppError>> {
    try {
      return ok(await this.repo.update(id, data));
    } catch (e) {
      return err(
        new AppError(
          'UPDATE_ACCOUNT_FAILED',
          e instanceof Error ? e.message : 'Unknown error',
        ),
      );
    }
  }

  public async delete(id: string): Promise<Result<void, AppError>> {
    try {
      await this.repo.delete(id);

      return ok(undefined);
    } catch (e) {
      return err(
        new AppError(
          'DELETE_ACCOUNT_FAILED',
          e instanceof Error ? e.message : 'Unknown error',
        ),
      );
    }
  }
}
