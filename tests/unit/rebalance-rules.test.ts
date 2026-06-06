import { calculateAssetDeviations, calculateCategoryDeviations } from '../../backend/src/shared/kernel/allocation-calculator.js';

describe('Rebalance rules - allocation deviations', () => {
  it('detects underallocated category', () => {
    const result = calculateCategoryDeviations(
      [
        { category: 'crypto', targetPercent: 20, value: 100 },
        { category: 'etf', targetPercent: 80, value: 900 },
      ],
      5,
    );

    const crypto = result.find((r) => r.category === 'crypto')!;

    expect(crypto.deviation).toBeLessThan(0);
    expect(crypto.needsRebalance).toBe(true);
  });

  it('detects overallocated category', () => {
    const result = calculateCategoryDeviations(
      [
        { category: 'crypto', targetPercent: 20, value: 300 },
        { category: 'etf', targetPercent: 80, value: 700 },
      ],
      5,
    );

    const crypto = result.find((r) => r.category === 'crypto')!;

    expect(crypto.deviation).toBeGreaterThan(0);
  });

  it('does not flag small deviations within threshold', () => {
    const result = calculateCategoryDeviations(
      [
        { category: 'crypto', targetPercent: 20, value: 240 },
        { category: 'etf', targetPercent: 80, value: 760 },
      ],
      5,
    );

    const crypto = result.find((r) => r.category === 'crypto')!;

    expect(crypto.needsRebalance).toBe(false);
  });

  it('calculates correct real percent', () => {
    const result = calculateCategoryDeviations(
      [
        { category: 'crypto', targetPercent: 20, value: 100 },
        { category: 'etf', targetPercent: 80, value: 900 },
      ],
      5,
    );

    const crypto = result.find((r) => r.category === 'crypto')!;

    expect(crypto.realPercent).toBe(10);
    expect(crypto.targetPercent).toBe(20);
  });
});

describe('Rebalance rules - asset deviations within category', () => {
  it('detects asset deviation within category', () => {
    const result = calculateAssetDeviations(
      [
        { assetId: '1', symbol: 'KLBN11', category: 'b3', targetPercent: 50, value: 100 },
        { assetId: '2', symbol: 'ITSA4', category: 'b3', targetPercent: 50, value: 300 },
      ],
      { b3: 400 },
      5,
    );

    const klbn = result.find((r) => r.symbol === 'KLBN11')!;

    expect(klbn.deviation).toBeLessThan(0);
    expect(klbn.needsRebalance).toBe(true);
  });

  it('handles missing category values', () => {
    const result = calculateAssetDeviations(
      [
        { assetId: '1', symbol: 'KLBN11', category: 'b3', targetPercent: 100, value: 0 },
      ],
      {},
      5,
    );

    const klbn = result.find((r) => r.symbol === 'KLBN11')!;

    expect(klbn.message).toContain('sem valuation');
  });

  it('reports deviation with sign', () => {
    const result = calculateAssetDeviations(
      [
        { assetId: '1', symbol: 'KLBN11', category: 'b3', targetPercent: 50, value: 300 },
        { assetId: '2', symbol: 'ITSA4', category: 'b3', targetPercent: 50, value: 100 },
      ],
      { b3: 400 },
      5,
    );

    const klbn = result.find((r) => r.symbol === 'KLBN11')!;

    expect(klbn.message).toContain('+');
  });
});
