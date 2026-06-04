export type Quote = {
  id: string;
  assetId: string;
  price: number;
  currency: string;
  asOf: Date;
  source: 'MANUAL' | 'IMPORT' | 'BENCHMARK';
};
