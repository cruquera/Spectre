describe('WeightedRebalanceStrategy', () => {
  const strategy = new WeightedRebalanceStrategy();

  it('distributes amount across underweight assets in block', () => {
    const suggestions = strategy.evaluate({
  blockAssetIds: ['a1', 'a2'],
  brokerageCost: 5,
  currency: 'BRL',
  deviations: [
        { assetId: 'a1', symbol: 'BTC', deviation: -10, needsRebalance: true },
        { assetId: 'a2', symbol: 'ETH', deviation: 5, needsRebalance: false },
      ],
  minLot: 10,
  thresholdPercent: 5,
  totalAmount: 1000
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
        { assetId: 'a1', symbol: 'BTC', deviation: -10, needsRebalance: true },
      ],
  minLot: 100,
  thresholdPercent: 5,
  totalAmount: 50
});

    expect(suggestions.every((s) => s.suggestedAmount === 0)).toBe(true);
  });
});
