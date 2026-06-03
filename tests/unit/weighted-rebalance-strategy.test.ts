import { WeightedRebalanceStrategy } from '../../backend/modules/strategies/infrastructure/weighted-rebalance-strategy';

describe('WeightedRebalanceStrategy', () => {
  const strategy = new WeightedRebalanceStrategy();

  it('distributes amount across underweight assets in block', () => {
    const suggestions = strategy.evaluate({
      blockAssetIds: ['a1', 'a2'],
      brokerageCost: 5,
      currency: 'BRL',
      deviations: [
        { assetId: 'a1', deviation: -10, needsRebalance: true, symbol: 'BTC' },
        { assetId: 'a2', deviation: 5, needsRebalance: false, symbol: 'ETH' },
      ],
      minLot: 10,
      thresholdPercent: 5,
      totalAmount: 1000,
    });

    expect(suggestions.length).toBeGreaterThan(0);
    const total = suggestions.reduce((s, x) => s + x.suggestedAmount, 0);

    expect(total).toBeLessThanOrEqual(995);
  });

  it('respects min lot constraint', () => {
    const suggestions = strategy.evaluate({
      blockAssetIds: ['a1'],
      brokerageCost: 0,
      currency: 'BRL',
      deviations: [
        { assetId: 'a1', deviation: -10, needsRebalance: true, symbol: 'BTC' },
      ],
      minLot: 100,
      thresholdPercent: 5,
      totalAmount: 50,
    });

    expect(suggestions.every((s) => s.suggestedAmount === 0)).toBe(true);
  });
});
