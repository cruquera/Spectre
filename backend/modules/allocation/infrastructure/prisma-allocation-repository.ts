import type { PrismaClient as UserPrismaClient } from '../../../../node_modules/.prisma/user-client/index.js';
import type { AllocationRepository } from '../application/allocation-repository.js';
import type { AssetTargetAllocation, CategoryAllocation } from '../domain/allocation.js';

export class PrismaAllocationRepository implements AllocationRepository {
  public constructor(private readonly db: UserPrismaClient) {}

  public async getPortfolio(portfolioId: string): Promise<{ id: string; baseCurrency: string }> {
    return this.db.portfolio.findUniqueOrThrow({ where: { id: portfolioId } });
  }

  public async setCategoryTarget(portfolioId: string, category: string, targetPercent: number): Promise<void> {
    await this.db.categoryAllocation.upsert({
      create: { category: category as 'CRYPTO', portfolioId, targetPercent },
      update: { targetPercent },
      where: {
        portfolioId_category: { category: category as 'CRYPTO', portfolioId },
      },
    });
  }

  public async setAssetTarget(portfolioId: string, assetId: string, targetPercent: number): Promise<void> {
    await this.db.assetTargetAllocation.upsert({
      create: { assetId, portfolioId, targetPercent },
      update: { targetPercent },
      where: { portfolioId_assetId: { assetId, portfolioId } },
    });
  }

  public async getCategoryTargets(portfolioId: string): Promise<CategoryAllocation[]> {
    return this.db.categoryAllocation.findMany({ where: { portfolioId } });
  }

  public async getAssetTargets(portfolioId: string): Promise<AssetTargetAllocation[]> {
    return this.db.assetTargetAllocation.findMany({
      include: { asset: true },
      where: { portfolioId },
    });
  }

  public async saveAnalysis(data: {
    portfolioId: string;
    thresholdPercent: number;
    results: string;
  }): Promise<void> {
    await this.db.rebalanceAnalysis.create({ data });
  }
}
