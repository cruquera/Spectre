import type { PortfolioRepository } from './portfolio-repository.js';
import { type Result, ok } from '../../../shared/kernel/result.js';
import type { Portfolio } from '../domain/portfolio.js';
import type { Position } from '../domain/position.js';
import type { Transaction } from '../domain/transaction.js';

export class PortfolioService {
  public constructor(private readonly repo: PortfolioRepository) {}

  public async list(): Promise<Result<Portfolio[], never>> {
    const items = await this.repo.list();

    return ok(items);
  }

  public async create(name: string, baseCurrency: string, accountIds?: string[]): Promise<Result<Portfolio, never>> {
    const portfolio = await this.repo.create(name, baseCurrency);

    if (accountIds?.length) {
      await this.repo.linkAccounts(portfolio.id, accountIds);
    }

    return ok(portfolio);
  }

  public async createTransaction(data: {
    accountId: string;
    assetId: string;
    type: string;
    quantity: number;
    unitPrice: number;
    fees: number;
    taxes: number;
    tradeDate: string;
    currency: string;
    fxRate?: number;
  }): Promise<Result<Transaction, never>> {
    const tx = await this.repo.createTransaction({
      ...data,
      tradeDate: new Date(data.tradeDate),
    });

    await this.repo.updatePositionAfterTransaction(
      data.accountId, data.assetId, data.type, data.quantity, data.unitPrice, data.currency,
    );

    return ok(tx);
  }

  public async listPositions(accountId?: string): Promise<Result<Position[], never>> {
    const items = await this.repo.listPositions(accountId);

    return ok(items);
  }
}
