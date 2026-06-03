import type { PrismaClient as UserPrismaClient } from '../../../../node_modules/.prisma/user-client/index.js';
import type { MarketDataRepository } from '../application/market-data-repository.js';
import type { ExchangeRate } from '../domain/exchange-rate.js';
import type { Quote } from '../domain/quote.js';

export class PrismaMarketDataRepository implements MarketDataRepository {
  public constructor(private readonly db: UserPrismaClient) {}

  public async createQuote(data: {
    asOf: Date;
    assetId: string;
    currency: string;
    price: number;
    source: 'MANUAL' | 'IMPORT' | 'BENCHMARK';
  }): Promise<Quote> {
    return this.db.quote.create({ data });
  }

  public async setExchangeRate(data: {
    asOf: Date;
    fromCurrency: string;
    toCurrency: string;
    rate: number;
    source: 'MANUAL' | 'IMPORT' | 'BENCHMARK';
  }): Promise<ExchangeRate> {
    return this.db.exchangeRate.create({ data });
  }
}
