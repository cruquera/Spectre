import type { AppContext } from '../../../shared/app-context.js';
import { ok } from '../../../shared/kernel/result.js';
import { AllocationService } from '../../allocation/application/allocation-service.js';
import { StrategyRegistry } from '../../strategies/application/strategy-registry.js';

export class ContributionService {
  private readonly allocation: AllocationService;
  private readonly registry = new StrategyRegistry();

  constructor(private readonly ctx: AppContext) {
    this.allocation = new AllocationService(ctx);
  }

  async createBlock(name: string, assetIds: string[]) {
    const db = this.ctx.getUserClient();
    const block = await db.investmentBlock.create({ data: { name } });

    await db.blockAsset.createMany({
      data: assetIds.map((assetId) => ({ blockId: block.id, assetId })),
    });

    return ok(block);
  }

  async setMonthlyBlock(year: number, month: number, blockId: string) {
    const db = this.ctx.getUserClient();

    await db.monthlyBlockSchedule.upsert({
      where: { year_month: { year, month } },
      create: { year, month, blockId },
      update: { blockId },
    });

    return ok(undefined);
  }

  async simulate(
    portfolioId: string,
    amount: number,
    currency: string,
    year: number,
    month: number,
  ) {
    const db = this.ctx.getUserClient();
    const config = await db.strategyConfig.findFirst({
      where: { portfolioId },
      include: { strategy: true },
    });
    const strategyKey = config?.strategy?.key ?? 'weighted-rebalance';
    const strategy = this.registry.get(strategyKey);

    if (!strategy) return ok([]);

    const params = JSON.parse(config?.parameters ?? '{}') as Record<string, number>;
    const threshold = params['thresholdPercent'] ?? 5;
    const minLot = params['minLot'] ?? 0;
    const brokerageCost = params['brokerageCost'] ?? 0;

    const analysis = await this.allocation.analyze(portfolioId, threshold);

    if (!analysis.ok) return ok([]);

    const schedule = await db.monthlyBlockSchedule.findUnique({
      where: { year_month: { year, month } },
      include: { block: { include: { assets: true } } },
    });
    const blockAssetIds = schedule?.block.assets.map((a) => a.assetId) ?? [];

    const suggestions = strategy.evaluate({
  blockAssetIds,
  brokerageCost,
  currency,
  deviations: analysis.value.assets.map((a) => ({
  assetId: a.assetId,
  deviation: a.deviation,
  needsRebalance: a.needsRebalance,
  symbol: a.symbol
})),
  minLot,
  thresholdPercent: threshold,
  totalAmount: amount
});

    const plan = await db.contributionPlan.create({
      data: {
  amount,
  currency,
  plannedDate: new Date(year, month - 1, 1),
  portfolioId,
  status: 'SIMULATED'
},
    });

    for (const s of suggestions) {
      await db.contributionSuggestion.create({
        data: {
  assetId: s.assetId,
  planId: plan.id,
  rationale: JSON.stringify({ text: s.rationale }),
  suggestedAmount: s.suggestedAmount
},
      });
    }

    return ok(suggestions);
  }
}
