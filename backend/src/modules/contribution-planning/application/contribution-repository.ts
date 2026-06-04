import type { BlockAsset, InvestmentBlock } from '../../investment-blocks/domain/investment-blocks.js';
import type { ContributionPlan, ContributionSuggestion } from '../domain/contribution-plan.js';

export type ContributionRepository = {
  createBlock(name: string): Promise<InvestmentBlock>;
  addBlockAssets(data: Array<{ assetId: string; blockId: string }>): Promise<void>;
  upsertMonthlyBlock(year: number, month: number, blockId: string): Promise<void>;
  getMonthlyBlock(year: number, month: number): Promise<{
    block: InvestmentBlock & { assets: BlockAsset[] };
  } | null>;
  getStrategyConfig(portfolioId: string): Promise<{
    strategy: { key: string } | null;
    parameters: string;
  } | null>;
  createPlan(data: {
    amount: number;
    currency: string;
    plannedDate: Date;
    portfolioId: string;
    status: string;
  }): Promise<ContributionPlan>;
  createSuggestion(data: {
    assetId: string;
    planId: string;
    rationale: string;
    suggestedAmount: number;
  }): Promise<ContributionSuggestion>;
}
