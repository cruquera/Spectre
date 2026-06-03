import type { PatrimonySnapshot } from '../domain/patrimony-snapshot.js';

export type PatrimonyRepository = {
  findPortfolioBaseCurrency(portfolioId: string): Promise<string>;
  createSnapshot(data: {
    breakdown: string;
    currency: string;
    portfolioId: string;
    totalValue: number;
  }): Promise<PatrimonySnapshot>;
  listSnapshots(portfolioId: string): Promise<PatrimonySnapshot[]>;
}
