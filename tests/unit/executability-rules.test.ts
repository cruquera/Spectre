import { allocationForCategory, suggestAssetAllocation } from '../../backend/src/shared/kernel/allocation-calculator.js';

describe('Executability rules - allocationForCategory', () => {
  it('allocates proportionally to deviated assets', () => {
    const result = allocationForCategory(100, [
      { id: '1', deviation: -10 },
      { id: '2', deviation: -30 },
    ]);

    expect(result).toHaveLength(2);
    expect(result[0].amount).toBeCloseTo(25, 1);
    expect(result[1].amount).toBeCloseTo(75, 1);
  });

  it('skips assets with positive deviation', () => {
    const result = allocationForCategory(100, [
      { id: '1', deviation: -10 },
      { id: '2', deviation: 5 },
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('returns empty when no deviation', () => {
    const result = allocationForCategory(100, [
      { id: '1', deviation: 0 },
      { id: '2', deviation: 0 },
    ]);

    expect(result).toHaveLength(0);
  });

  it('handles single negative deviation', () => {
    const result = allocationForCategory(100, [
      { id: '1', deviation: -50 },
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].amount).toBe(100);
  });
});

describe('Executability rules - suggestAssetAllocation', () => {
  it('suggests allocation for executable asset', () => {
    const result = suggestAssetAllocation({
      contributionAmount: 1000,
      deviation: -10,
      targetPercent: 50,
      realPercent: 40,
      minimumInvestment: 0,
      fractionalAllowed: true,
      lotSize: 0,
    });

    expect(result.executable).toBe(true);
    expect(result.amount).toBeGreaterThan(0);
    expect(result.skipReason).toBeUndefined();
  });

  it('skips asset below minimum investment', () => {
    const result = suggestAssetAllocation({
      contributionAmount: 50,
      deviation: -5,
      targetPercent: 30,
      realPercent: 25,
      minimumInvestment: 100,
      fractionalAllowed: true,
      lotSize: 0,
    });

    expect(result.executable).toBe(false);
    expect(result.skipReason).toContain('mínimo');
  });

  it('handles non-fractional asset with lot size', () => {
    const result = suggestAssetAllocation({
      contributionAmount: 1000,
      deviation: -10,
      targetPercent: 50,
      realPercent: 40,
      minimumInvestment: 0,
      fractionalAllowed: false,
      lotSize: 100,
    });

    expect(result.executable).toBe(true);
    expect(result.amount).toBeGreaterThan(0);
  });
});
