import type { CreateLedgerEventData, LedgerEvent } from '../domain/ledger-event.js';

export type LedgerEventRepository = {
  create(data: CreateLedgerEventData): Promise<LedgerEvent>;
  findByPortfolioId(portfolioId: string): Promise<LedgerEvent[]>;
  findRecent(limit: number): Promise<LedgerEvent[]>;
  delete(id: string): Promise<void>;
};
