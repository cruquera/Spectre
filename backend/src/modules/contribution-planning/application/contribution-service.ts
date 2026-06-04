import type { ContributionRepository } from './contribution-repository.js';
import type { AppContext } from '../../../shared/app-context.js';
import { type Result, ok } from '../../../shared/kernel/result.js';
import { AllocationService } from '../../allocation/application/allocation-service.js';
import type { InvestmentBlock } from '../../investment-blocks/domain/investment-blocks.js';
import { StrategyRegistry } from '../../strategies/application/strategy-registry.js';
import type { StrategySuggestion } from '../../strategies/domain/contribution-strategy.js';

export class ContributionService {
  private readonly registry = new StrategyRegistry();

  public constructor(
    private readonly ctx: AppContext,
    private readonly repo: ContributionRepository,
    private readonly allocation: AllocationService,
  ) {}

  public async createBlock(name: string, assetIds: string[]): Promise<Result<InvestmentBlock, never>> {
    const block = await this.repo.createBlock(name);

    await this.repo.addBlockAssets(
      assetIds.map((assetId) => ({ assetId, blockId: block.id })),
    );

    return ok(block);
  }

  public async setMonthlyBlock(year: number, month: number, blockId: string): Promise<Result<void, never>> {
    await this.repo.upsertMonthlyBlock(year, month, blockId);

    return ok(undefined);
  }

  public async simulate(
    portfolioId: string,
    amount: number,
    currency: string,
    year: number,
    month: number,
  ): Promise<Result<StrategySuggestion[], never>> {
    const config = await this.repo.getStrategyConfig(portfolioId);
    const strategyKey = config?.strategy?.key ?? 'weighted-rebalance';
    const strategy = this.registry.get(strategyKey);

    if (!strategy) return ok([]);

    const params = JSON.parse(config?.parameters ?? '{}') as Record<string, number>;
    const threshold = params['thresholdPercent'] ?? 5;
    const minLot = params['minLot'] ?? 0;
    const brokerageCost = params['brokerageCost'] ?? 0;

    const analysis = await this.allocation.analyze(portfolioId, threshold);

    if (!analysis.ok) return ok([]);

    const schedule = await this.repo.getMonthlyBlock(year, month);
    const blockAssetIds = schedule?.block.assets.map((a) => a.assetId) ?? [];

    const suggestions = strategy.evaluate({
      blockAssetIds,
      brokerageCost,
      currency,
      deviations: analysis.value.assets.map((a) => ({
        assetId: a.assetId,
        deviation: a.deviation,
        needsRebalance: a.needsRebalance,
        symbol: a.symbol,
      })),
      minLot,
      thresholdPercent: threshold,
      totalAmount: amount,
    });

    const plan = await this.repo.createPlan({
      amount,
      currency,
      plannedDate: new Date(year, month - 1, 1),
      portfolioId,
      status: 'SIMULATED',
    });

    for (const s of suggestions) {
      await this.repo.createSuggestion({
        assetId: s.assetId,
        planId: plan.id,
        rationale: JSON.stringify({ text: s.rationale }),
        suggestedAmount: s.suggestedAmount,
      });
    }

    return ok(suggestions);
  }
}
