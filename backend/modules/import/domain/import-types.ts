export type QuoteSource = 'MANUAL' | 'IMPORT' | 'BENCHMARK';

export type ExchangeRate = {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  asOf: Date;
  source: QuoteSource;
};

export type AssetRef = {
  id: string;
  symbol: string;
  currency: string;
};

export type Quote = {
  id: string;
  assetId: string;
  price: number;
  currency: string;
  asOf: Date;
  source: QuoteSource;
};

export type Transaction = {
  id: string;
  accountId: string;
  assetId: string;
  type: string;
  quantity: number;
  unitPrice: number;
  currency: string;
  tradeDate: Date;
};
