import { allocationForCategory, calculateCategoryDeviations, suggestAssetAllocation } from '../../backend/src/shared/kernel/allocation-calculator.js';

describe('Investment Portfolio - Allocation Calculator', () => {
  describe('calculateCategoryDeviations', () => {
    it('returns deviations for each category', () => {
      const result = calculateCategoryDeviations([
        { category: 'crypto', targetPercent: 30, value: 2000 },
        { category: 'fixed_income_post', targetPercent: 70, value: 8000 },
      ], 5);

      expect(result).toHaveLength(2);
      expect(result[0].category).toBe('crypto');
      expect(result[0].realPercent).toBe(20);
      expect(result[0].targetPercent).toBe(30);
      expect(result[0].deviation).toBeCloseTo(-10, 1);
      expect(result[0].needsRebalance).toBe(true);
    });

    it('marks as needsRebalance when deviation exceeds threshold', () => {
      const result = calculateCategoryDeviations([
        { category: 'crypto', targetPercent: 50, value: 6000 },
        { category: 'fixed_income_post', targetPercent: 50, value: 4000 },
      ], 5);

      expect(result[0].needsRebalance).toBe(true);
    });

    it('marks as OK when deviation is within threshold', () => {
      const result = calculateCategoryDeviations([
        { category: 'crypto', targetPercent: 50, value: 5100 },
        { category: 'fixed_income_post', targetPercent: 50, value: 4900 },
      ], 5);

      expect(result[0].needsRebalance).toBe(false);
    });

    it('handles single category', () => {
      const result = calculateCategoryDeviations([
        { category: 'crypto', targetPercent: 100, value: 10000 },
      ], 5);

      expect(result).toHaveLength(1);
      expect(result[0].deviation).toBeCloseTo(0, 1);
    });

    it('handles zero total value', () => {
      const result = calculateCategoryDeviations([
        { category: 'crypto', targetPercent: 100, value: 0 },
      ], 5);

      expect(result[0].realPercent).toBe(0);
    });
  });

  describe('allocationForCategory', () => {
    it('splits amount among under-allocated categories', () => {
      const result = allocationForCategory(1000, [
        { id: 'cat1', deviation: -10 },
        { id: 'cat2', deviation: -30 },
      ]);

      expect(result).toHaveLength(2);
      expect(result[0].amount).toBe(250);
      expect(result[1].amount).toBe(750);
    });

    it('returns empty when no negative deviations', () => {
      const result = allocationForCategory(1000, [
        { id: 'cat1', deviation: 5 },
        { id: 'cat2', deviation: 10 },
      ]);

      expect(result).toHaveLength(0);
    });

    it('returns empty for near-zero deviations', () => {
      const result = allocationForCategory(1000, [
        { id: 'cat1', deviation: -0.005 },
      ]);

      expect(result).toHaveLength(0);
    });
  });

  describe('suggestAssetAllocation', () => {
    it('returns executable suggestion when amount meets minimum', () => {
      const result = suggestAssetAllocation({
        contributionAmount: 500,
        deviation: -10,
        targetPercent: 30,
        realPercent: 20,
        minimumInvestment: 100,
        fractionalAllowed: true,
        lotSize: 1,
      });

      expect(result.executable).toBe(true);
      expect(result.amount).toBeGreaterThan(0);
    });

    it('skips asset already at or above target', () => {
      const result = suggestAssetAllocation({
        contributionAmount: 500,
        deviation: 5,
        targetPercent: 30,
        realPercent: 35,
        minimumInvestment: 100,
        fractionalAllowed: true,
        lotSize: 1,
      });

      expect(result.executable).toBe(false);
      expect(result.skipReason).toContain('alvo');
    });

    it('skips when contribution is below minimum investment', () => {
      const result = suggestAssetAllocation({
        contributionAmount: 50,
        deviation: -10,
        targetPercent: 30,
        realPercent: 20,
        minimumInvestment: 100,
        fractionalAllowed: true,
        lotSize: 1,
      });

      expect(result.executable).toBe(false);
      expect(result.skipReason).toContain('mínimo');
    });
  });
});
