export type EventType = 'INVESTMENT_CONTRIBUTION' | 'ASSET_PURCHASE' | 'ASSET_SALE' | 'DIVIDEND_INCOME' | 'INTEREST_INCOME' | 'CRYPTO_STAKING' | 'MANUAL_ADJUSTMENT';

export type LedgerEvent = {
  id: string;
  eventType: EventType;
  grossAmount: number;
  feesAmount: number;
  taxAmount: number;
  netAmount: number;
  currency: string;
  occurredAt: Date;
  notes: string | null;
  createdAt: Date;
  portfolioId: string;
  accountId: string;
  assetValueId: string;
  portfolioName?: string;
  accountName?: string;
  assetClassName?: string;
};

export type CreateLedgerEventData = {
  eventType: EventType;
  grossAmount: number;
  feesAmount?: number;
  taxAmount?: number;
  netAmount: number;
  currency: string;
  occurredAt: Date;
  notes?: string | null;
  portfolioId: string;
  accountId: string;
  assetValueId: string;
};
