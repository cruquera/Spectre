import type { PrismaClient as UserPrismaClient } from '../../../../node_modules/.prisma/user-client/index.js';
import type { ImportRepository } from '../application/import-repository.js';
import type { AssetRef, ExchangeRate, Quote, Transaction } from '../domain/import-types.js';

export class PrismaImportRepository implements ImportRepository {
  public constructor(private readonly db: UserPrismaClient) {}

  public async createExchangeRate(data: {
    asOf: Date;
    fromCurrency: string;
    rate: number;
    source: 'MANUAL' | 'IMPORT' | 'BENCHMARK';
    toCurrency: string;
  }): Promise<ExchangeRate> {
    return this.db.exchangeRate.create({ data });
  }

  public async findAssetBySymbol(symbol: string): Promise<AssetRef | null> {
    return this.db.asset.findFirst({
      select: { currency: true, id: true, symbol: true },
      where: { symbol },
    });
  }

  public async createQuote(data: {
    asOf: Date;
    assetId: string;
    currency: string;
    price: number;
    source: 'MANUAL' | 'IMPORT' | 'BENCHMARK';
  }): Promise<Quote> {
    return this.db.quote.create({ data });
  }

  public async createTransaction(data: {
    accountId: string;
    assetId: string;
    currency: string;
    quantity: number;
    tradeDate: Date;
    type: 'BUY' | 'SELL';
    unitPrice: number;
  }): Promise<Transaction> {
    return this.db.transaction.create({ data });
  }
}
