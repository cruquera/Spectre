import type { InvestmentPortfolio } from '../domain/investment-portfolio.js';

export type CreatePortfolioData = {
  name: string;
  userProfileId: string;
  templateId: string;
  assetValues: Array<{
    assetClass: string;
    optionalTickerDescription: string | null;
    targetPercentage: number;
    classTargetId: string | null;
  }>;
};

export type UpdateAssetValueData = {
  id: string;
  currentValue: number;
};

export type InvestmentPortfolioRepository = {
  findAll(): Promise<InvestmentPortfolio[]>;
  findById(id: string): Promise<InvestmentPortfolio | null>;
  create(data: CreatePortfolioData): Promise<InvestmentPortfolio>;
  updateAssetValues(portfolioId: string, values: UpdateAssetValueData[]): Promise<void>;
  delete(id: string): Promise<void>;
};
