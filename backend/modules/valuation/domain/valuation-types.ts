export type PortfolioAccountLink = {
  id: string;
  portfolioId: string;
  accountId: string;
};

export type PositionWithAsset = {
  id: string;
  accountId: string;
  assetId: string;
  quantity: number;
  averageCost: number;
  costCurrency: string;
  asset: {
    id: string;
    symbol: string;
    currency: string;
    category: string;
  };
};

export type Quote = {
  id: string;
  assetId: string;
  price: number;
  currency: string;
  asOf: Date;
  source: string;
};

export type ExchangeRate = {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  asOf: Date;
  source: string;
};
