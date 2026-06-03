import type { ExchangeRate, PositionWithAsset, Quote } from '../domain/valuation-types.js';

export type ValuationRepository = {
  findAccountIdsByPortfolio(portfolioId: string): Promise<string[]>;
  findPositionsWithAssets(accountIds: string[]): Promise<PositionWithAsset[]>;
  findLatestQuote(assetId: string): Promise<Quote | null>;
  findLatestExchangeRate(from: string, to: string): Promise<ExchangeRate | null>;
}
