export type PortfolioStrategy = 'FREE_ALLOCATION' | 'ASSET_CLASS_ALLOCATION';

export type AssetClassValue =
  | 'cash_reserve'
  | 'fixed_income_post'
  | 'fixed_income_pre'
  | 'fixed_income_inflation'
  | 'debentures'
  | 'investment_funds'
  | 'retirement_funds'
  | 'real_estate_funds'
  | 'etf_brazil'
  | 'etf_global'
  | 'stock_picking_b3'
  | 'stock_picking_nasdaq'
  | 'stock_picking_nyse'
  | 'stock_picking_europe'
  | 'stock_picking_asia'
  | 'reits'
  | 'commodities'
  | 'precious_metals'
  | 'crypto'
  | 'alternative_assets';

export type PortfolioAssetTarget = {
  id: string;
  assetClass: AssetClassValue;
  optionalTickerDescription: string | null;
  allocationPercentage: number;
  minimumInvestment: number;
  fractionalAllowed: boolean;
  lotSize: number;
  templateId: string;
};

export type PortfolioTemplate = {
  id: string;
  name: string;
  description: string | null;
  strategy: PortfolioStrategy;
  benchmark: string | null;
  baseCurrency: string;
  isDefault: boolean;
  targets: PortfolioAssetTarget[];
  userProfileId: string;
  createdAt: Date;
  updatedAt: Date;
};
