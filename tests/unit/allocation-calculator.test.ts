import {
  calculateAssetDeviations,
  calculateCategoryDeviations,
} from '../../backend/src/modules/allocation/domain/allocation-calculator.js';

describe('AllocationCalculator', () => {
  it('calculates category deviations', () => {
    const result = calculateCategoryDeviations(
      [
        { category: 'CRYPTO', targetPercent: 20, value: 300 },
        { category: 'VARIABLE_INCOME', targetPercent: 80, value: 700 },
      ],
      5,
    );

    expect(result[0].realPercent).toBe(30);
    expect(result[0].deviation).toBe(10);
    expect(result[0].needsRebalance).toBe(true);
  });

  it('calculates asset deviations within category', () => {
    const result = calculateAssetDeviations(
      [
        {
          assetId: '1',
          category: 'CRYPTO',
          symbol: 'BTC',
          targetPercent: 50,
          value: 70,
        },
        {
          assetId: '2',
          category: 'CRYPTO',
          symbol: 'ETH',
          targetPercent: 50,
          value: 30,
        },
      ],
      { CRYPTO: 100 },
      5,
    );

    expect(result[0].realPercent).toBe(70);
    expect(result[0].needsRebalance).toBe(true);
    expect(result[0].message).toContain('BTC');
  });

  it('handles catTotal = 0 gracefully', () => {
    const result = calculateAssetDeviations(
      [
        {
          assetId: '1',
          category: 'CRYPTO',
          symbol: 'BTC',
          targetPercent: 100,
          value: 0,
        },
      ],
      { CRYPTO: 0 },
      5,
    );

    expect(result[0].realPercent).toBe(0);
    expect(result[0].deviation).toBe(-100);
    expect(result[0].needsRebalance).toBe(true);
  });
});
