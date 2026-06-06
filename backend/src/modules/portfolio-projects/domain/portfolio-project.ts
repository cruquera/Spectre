export type AssetTypeValue = 'STOCKPICKING' | 'CRYPTO' | 'DEBENTURE' | 'INVESTMENT_FUND' | 'PENSION_FUND' | 'FII' | 'ETF' | 'BDR' | 'TREASURY';

export type Asset = {
  id: string;
  type: AssetTypeValue;
  targetPercentage: number;
  initialValue: number;
  name: string | null;
  portfolioProjectId: string;
};

export type PortfolioProject = {
  id: string;
  name: string;
  assets: Asset[];
  userProfileId: string;
  createdAt: Date;
  updatedAt: Date;
};
