import type { PrismaClient as UserPrismaClient } from '../../../../node_modules/.prisma/user-client/index.js';
import type { Account } from '../domain/account.js';
import type { AccountRepository } from '../application/account-repository.js';

export class PrismaAccountRepository implements AccountRepository {
  public constructor(private readonly db: UserPrismaClient) {}

  public async findAll(): Promise<Account[]> {
    return this.db.account.findMany();
  }

  public async findById(id: string): Promise<Account | null> {
    return this.db.account.findUnique({ where: { id } });
  }

  public async create(data: Omit<Account, 'id'>): Promise<Account> {
    return this.db.account.create({ data });
  }

  public async update(
    id: string,
    data: Partial<Omit<Account, 'id' | 'userProfileId'>>,
  ): Promise<Account> {
    const existing = await this.db.account.findUniqueOrThrow({ where: { id } });

    return this.db.account.update({
      data: {
        institutionName: data.institutionName ?? existing.institutionName,
        nickname: data.nickname ?? existing.nickname,
        currency: data.currency ?? existing.currency,
      },
      where: { id },
    });
  }

  public async delete(id: string): Promise<void> {
    await this.db.account.delete({ where: { id } });
  }
}
