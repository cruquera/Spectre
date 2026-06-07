export type InvestmentPortfolioStatus = 'ACTIVE' | 'ARCHIVED';

export type PortfolioAssetValue = {
  id: string;
  assetClass: string;
  optionalTickerDescription: string | null;
  targetPercentage: number;
  currentValue: number;
  classTargetId: string | null;
};

export type InvestmentPortfolio = {
  id: string;
  name: string;
  status: InvestmentPortfolioStatus;
  createdAt: Date;
  updatedAt: Date;
  userProfileId: string;
  templateId: string;
  assetValues: PortfolioAssetValue[];
};

export type DashboardSummary = {
  portfolioCount: number;
  totalInvested: number;
  totalAccounts: number;
  recentEvents: number;
  deviations: Array<{
    portfolioId: string;
    portfolioName: string;
    assetClass: string;
    targetPercent: number;
    realPercent: number;
    deviation: number;
    needsRebalance: boolean;
  }>;
};
