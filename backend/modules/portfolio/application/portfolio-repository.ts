import type { Portfolio } from '../domain/portfolio.js';
import type { Position } from '../domain/position.js';
import type { Transaction } from '../domain/transaction.js';

export type PortfolioRepository = {
  list(): Promise<Portfolio[]>;
  create(name: string, baseCurrency: string): Promise<Portfolio>;
  linkAccounts(portfolioId: string, accountIds: string[]): Promise<void>;
  createTransaction(data: {
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
  }): Promise<Transaction>;
  updatePositionAfterTransaction(
    accountId: string,
    assetId: string,
    type: string,
    quantity: number,
    unitPrice: number,
    currency: string,
  ): Promise<void>;
  listPositions(accountId?: string): Promise<Position[]>;
}
