export type ExchangeRate = {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  asOf: Date;
  source: 'MANUAL' | 'IMPORT' | 'BENCHMARK';
};
