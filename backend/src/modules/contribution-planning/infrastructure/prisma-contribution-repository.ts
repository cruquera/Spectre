import type { PrismaClient as UserPrismaClient } from '../../../../node_modules/.prisma/user-client/index.js';
import type { ContributionRepository } from '../application/contribution-repository.js';
import type { ContributionPlan, ContributionSuggestion } from '../domain/contribution-plan.js';
import type { BlockAsset, InvestmentBlock } from '../domain/investment-block.js';

export class PrismaContributionRepository implements ContributionRepository {
  public constructor(private readonly db: UserPrismaClient) {}

  public async createBlock(name: string): Promise<InvestmentBlock> {
    return this.db.investmentBlock.create({ data: { name } });
  }

  public async addBlockAssets(data: Array<{ assetId: string; blockId: string }>): Promise<void> {
    await this.db.blockAsset.createMany({ data });
  }

  public async upsertMonthlyBlock(year: number, month: number, blockId: string): Promise<void> {
    await this.db.monthlyBlockSchedule.upsert({
      create: { blockId, month, year },
      update: { blockId },
      where: { year_month: { month, year } },
    });
  }

  public async getMonthlyBlock(year: number, month: number): Promise<{
    block: InvestmentBlock & { assets: BlockAsset[] };
  } | null> {
    const result = await this.db.monthlyBlockSchedule.findUnique({
      include: { block: { include: { assets: true } } },
      where: { year_month: { month, year } },
    });

    return result;
  }

  public async getStrategyConfig(portfolioId: string): Promise<{
    strategy: { key: string } | null;
    parameters: string;
  } | null> {
    return this.db.strategyConfig.findFirst({
      include: { strategy: true },
      where: { portfolioId },
    });
  }

  public async createPlan(data: {
    amount: number;
    currency: string;
    plannedDate: Date;
    portfolioId: string;
    status: string;
  }): Promise<ContributionPlan> {
    return this.db.contributionPlan.create({ data });
  }

  public async createSuggestion(data: {
    assetId: string;
    planId: string;
    rationale: string;
    suggestedAmount: number;
  }): Promise<ContributionSuggestion> {
    return this.db.contributionSuggestion.create({ data });
  }
}
