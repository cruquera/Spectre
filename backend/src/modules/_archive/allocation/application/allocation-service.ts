import type { AllocationRepository } from './allocation-repository.js';
import type { AppContext } from '../../../shared/app-context.js';
import { type Result, ok } from '../../../shared/kernel/result.js';
import { ValuationService } from '../../valuation/application/valuation-service.js';
import {
  type AllocationDeviation,
  type AssetDeviation,
  calculateAssetDeviations,
  calculateCategoryDeviations,
} from '../domain/allocation-calculator.js';

export class AllocationService {
  private readonly valuation: ValuationService;

  public constructor(
    private readonly ctx: AppContext,
    private readonly repo: AllocationRepository,
    valuation: ValuationService,
  ) {
    this.valuation = valuation;
  }

  public async setCategoryTarget(portfolioId: string, category: string, targetPercent: number): Promise<Result<void, never>> {
    await this.repo.setCategoryTarget(portfolioId, category, targetPercent);

    return ok(undefined);
  }

  public async setAssetTarget(portfolioId: string, assetId: string, targetPercent: number): Promise<Result<void, never>> {
    await this.repo.setAssetTarget(portfolioId, assetId, targetPercent);

    return ok(undefined);
  }

  public async analyze(portfolioId: string, thresholdPercent: number): Promise<Result<{ assets: AssetDeviation[]; categories: AllocationDeviation[]; portfolioId: string; thresholdPercent: number }, never>> {
    const portfolio = await this.repo.getPortfolio(portfolioId);
    const valuation = await this.valuation.getPortfolioValue(portfolioId, portfolio.baseCurrency);

    if (!valuation.ok) throw new Error('Valuation failed');

    const categoryTargets = await this.repo.getCategoryTargets(portfolioId);
    const assetTargets = await this.repo.getAssetTargets(portfolioId);

    const breakdown = valuation.value.breakdown;
    const categoryValues: Record<string, number> = {};

    for (const at of assetTargets) {
      const v = breakdown[at.asset!.symbol] ?? 0;

      categoryValues[at.asset!.category] = (categoryValues[at.asset!.category] ?? 0) + v;
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
        category: at.asset!.category,
        symbol: at.asset!.symbol,
        targetPercent: at.targetPercent,
        value: breakdown[at.asset!.symbol] ?? 0,
      })),
      categoryValues,
      thresholdPercent,
    );

    await this.repo.saveAnalysis({
      portfolioId,
      results: JSON.stringify({ assets, categories }),
      thresholdPercent,
    });

    return ok({ assets, categories, portfolioId, thresholdPercent });
  }
}
