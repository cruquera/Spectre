import type { AssetRef, ExchangeRate, Quote, QuoteSource, Transaction } from '../domain/import-types.js';

export type ImportRepository = {
  createExchangeRate(data: {
    asOf: Date;
    fromCurrency: string;
    rate: number;
    source: QuoteSource;
    toCurrency: string;
  }): Promise<ExchangeRate>;
  findAssetBySymbol(symbol: string): Promise<AssetRef | null>;
  createQuote(data: {
    asOf: Date;
    assetId: string;
    currency: string;
    price: number;
    source: QuoteSource;
  }): Promise<Quote>;
  createTransaction(data: {
    accountId: string;
    assetId: string;
    currency: string;
    quantity: number;
    tradeDate: Date;
    type: 'BUY' | 'SELL';
    unitPrice: number;
  }): Promise<Transaction>;
}
