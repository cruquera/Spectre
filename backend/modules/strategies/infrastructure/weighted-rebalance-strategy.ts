import type {
  ContributionStrategy,
  StrategyContext,
  StrategySuggestion,
} from '../domain/contribution-strategy.js';

export class WeightedRebalanceStrategy implements ContributionStrategy {
  readonly key = 'weighted-rebalance';

  evaluate(context: StrategyContext): StrategySuggestion[] {
    const eligible = context.deviations.filter(
      (d) =>
        context.blockAssetIds.includes(d.assetId) &&
        (d.needsRebalance || context.blockAssetIds.length > 0),
    );
    if (eligible.length === 0) {
      return [];
    }

    const weights = eligible.map((d) => ({
      assetId: d.assetId,
      symbol: d.symbol,
      weight: Math.max(0.01, -d.deviation),
    }));
    const totalWeight = weights.reduce((s, w) => s + w.weight, 0);
    const netAmount = Math.max(0, context.totalAmount - context.brokerageCost);

    return weights.map((w) => {
      const suggestedAmount =
        Math.round((w.weight / totalWeight) * netAmount * 100) / 100;
      const adjusted =
        suggestedAmount < context.minLot && suggestedAmount > 0
          ? 0
          : suggestedAmount;
      return {
        assetId: w.assetId,
        symbol: w.symbol,
        suggestedAmount: adjusted,
        rationale: `Rebalanceamento ponderado (peso ${w.weight.toFixed(2)})`,
      };
    }).filter((s) => s.suggestedAmount > 0);
  }
}
