import type { PrismaClient as UserPrismaClient } from '../../../../node_modules/.prisma/user-client/index.js';
import type { PortfolioRepository } from '../application/portfolio-repository.js';
import type { Portfolio } from '../domain/portfolio.js';
import type { Position } from '../domain/position.js';
import type { Transaction } from '../domain/transaction.js';

export class PrismaPortfolioRepository implements PortfolioRepository {
  public constructor(private readonly db: UserPrismaClient) {}

  public async list(): Promise<Portfolio[]> {
    return this.db.portfolio.findMany({ orderBy: { name: 'asc' } });
  }

  public async create(name: string, baseCurrency: string): Promise<Portfolio> {
    return this.db.portfolio.create({ data: { baseCurrency, name } });
  }

  public async linkAccounts(portfolioId: string, accountIds: string[]): Promise<void> {
    if (!accountIds.length) return;

    await this.db.portfolioAccount.createMany({
      data: accountIds.map((accountId) => ({ accountId, portfolioId })),
    });
  }

  public async createTransaction(data: {
    accountId: string;
    assetId: string;
    type: string;
    quantity: number;
    unitPrice: number;
    fees: number;
    taxes: number;
    tradeDate: Date;
    currency: string;
    fxRate?: number;
  }): Promise<Transaction> {
    return this.db.transaction.create({
      data: {
        ...data,
        type: data.type as 'BUY' | 'SELL',
      },
    });
  }

  public async updatePositionAfterTransaction(
    accountId: string,
    assetId: string,
    type: string,
    quantity: number,
    unitPrice: number,
    currency: string,
  ): Promise<void> {
    const existing = await this.db.position.findUnique({
      where: { accountId_assetId: { accountId, assetId } },
    });
    const delta = type === 'SELL' ? -quantity : quantity;

    if (!existing) {
      if (delta > 0) {
        await this.db.position.create({
          data: { accountId, assetId, averageCost: unitPrice, costCurrency: currency, quantity: delta },
        });
      }

      return;
    }

    await this.db.position.update({
      data: { quantity: existing.quantity + delta },
      where: { id: existing.id },
    });
  }

  public async listPositions(accountId?: string): Promise<Position[]> {
    return this.db.position.findMany({
      include: { asset: true },
      where: accountId ? { accountId } : undefined,
    });
  }
}
