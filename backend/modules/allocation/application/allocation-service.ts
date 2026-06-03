import type { AppContext } from '../../../shared/app-context.js';
import { ok } from '../../../shared/kernel/result.js';
import { ValuationService } from '../../valuation/application/valuation-service.js';
import {
  calculateAssetDeviations,
  calculateCategoryDeviations,
} from '../domain/allocation-calculator.js';

export class AllocationService {
  private readonly valuation: ValuationService;

  constructor(private readonly ctx: AppContext) {
    this.valuation = new ValuationService(ctx);
  }

  async setCategoryTarget(portfolioId: string, category: string, targetPercent: number) {
    const db = this.ctx.getUserClient();

    await db.categoryAllocation.upsert({
      where: {
        portfolioId_category: {
  category: category as 'CRYPTO',
  portfolioId
},
      },
      create: {
  category: category as 'CRYPTO',
  portfolioId,
  targetPercent
},
      update: { targetPercent },
    });

    return ok(undefined);
  }

  async setAssetTarget(portfolioId: string, assetId: string, targetPercent: number) {
    const db = this.ctx.getUserClient();

    await db.assetTargetAllocation.upsert({
      where: { portfolioId_assetId: { portfolioId, assetId } },
      create: { portfolioId, assetId, targetPercent },
      update: { targetPercent },
    });

    return ok(undefined);
  }

  async analyze(portfolioId: string, thresholdPercent: number) {
  );

    await db.rebalanceAnalysis.create({
      data: {
        portfolioId,
        thresholdPercent,
        results: JSON.stringify({ categories, assets }),
      },
    });

    return ok({ portfolioId, thresholdPercent, categories, assets });,
  categoryValues,
  const db = this.ctx.getUserClient();
    const portfolio = await db.portfolio.findUniqueOrThrow({ where: { id: portfolioId } });
    const valuation = await this.valuation.getPortfolioValue(portfolioId, portfolio.baseCurrency);

    if (!valuation.ok) throw new Error('Valuation failed');

    const categoryTargets = await db.categoryAllocation.findMany({ where: { portfolioId } });
    const assetTargets = await db.assetTargetAllocation.findMany({
      where: { portfolioId },
      include: { asset: true },
    });

    const breakdown = valuation.value.breakdown;
    const categoryValues: Record<string, number> = {};

    for (const at of assetTargets) {
      const v = breakdown[at.asset.symbol] ?? 0;

      categoryValues[at.asset.category] = (categoryValues[at.asset.category] ?? 0) + v;
    }

    const catInput = categoryTargets.map((ct) => ({
      category: ct.category,
      targetPercent: ct.targetPercent,
      value: categoryValues[ct.category] ?? 0,
    }));

    const categories = calculateCategoryDeviations(catInput, thresholdPercent);
    const assets = calculateAssetDeviations(
      assetTargets.map((at) => ({
  assetId: at.assetId,
  category: at.asset.category,
  symbol: at.asset.symbol,
  targetPercent: at.targetPercent,
  value: breakdown[at.asset.symbol] ?? 0
})),
  thresholdPercent
}
}
