import { WeightedRebalanceStrategy } from '../../backend/modules/strategies/infrastructure/weighted-rebalance-strategy';

describe('WeightedRebalanceStrategy', () => {
  const strategy = new WeightedRebalanceStrategy();

  it('distributes amount across underweight assets in block', () => {
    const suggestions = strategy.evaluate({
      totalAmount: 1000,
      currency: 'BRL',
      deviations: [
        { assetId: 'a1', symbol: 'BTC', deviation: -10, needsRebalance: true },
        { assetId: 'a2', symbol: 'ETH', deviation: 5, needsRebalance: false },
      ],
      blockAssetIds: ['a1', 'a2'],
      thresholdPercent: 5,
      minLot: 10,
      brokerageCost: 5,
    });
    expect(suggestions.length).toBeGreaterThan(0);
    const total = suggestions.reduce((s, x) => s + x.suggestedAmount, 0);
    expect(total).toBeLessThanOrEqual(995);
  });

  it('respects min lot constraint', () => {
    const suggestions = strategy.evaluate({
      totalAmount: 50,
      currency: 'BRL',
      deviations: [
        { assetId: 'a1', symbol: 'BTC', deviation: -10, needsRebalance: true },
      ],
      blockAssetIds: ['a1'],
      thresholdPercent: 5,
      minLot: 100,
      brokerageCost: 0,
    });
    expect(suggestions.every((s) => s.suggestedAmount === 0)).toBe(true);
  });
});
