import type { ExchangeRate } from '../domain/exchange-rate.js';
import type { Quote } from '../domain/quote.js';

export type MarketDataRepository = {
  createQuote(data: {
    asOf: Date;
    assetId: string;
    currency: string;
    price: number;
    source: 'MANUAL' | 'IMPORT' | 'BENCHMARK';
  }): Promise<Quote>;
  setExchangeRate(data: {
    asOf: Date;
    fromCurrency: string;
    toCurrency: string;
    rate: number;
    source: 'MANUAL' | 'IMPORT' | 'BENCHMARK';
  }): Promise<ExchangeRate>;
}
