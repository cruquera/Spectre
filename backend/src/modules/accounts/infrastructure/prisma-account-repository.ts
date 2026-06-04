import type { PrismaClient as UserPrismaClient } from '../../../../node_modules/.prisma/user-client/index.js';
import type { AccountRepository } from '../application/account-repository.js';
import type { Account } from '../domain/account.js';

export class PrismaAccountRepository implements AccountRepository {
  public constructor(private readonly db: UserPrismaClient) {}

  public async list(institutionId?: string): Promise<Account[]> {
    return this.db.account.findMany({
      orderBy: { name: 'asc' },
      where: institutionId ? { institutionId } : undefined,
    });
  }

  public async create(institutionId: string, name: string, currency: string): Promise<Account> {
    return this.db.account.create({
      data: { currency, institutionId, name },
    });
  }
}
