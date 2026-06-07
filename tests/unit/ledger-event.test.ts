import { allocationForCategory } from '../../backend/src/shared/kernel/allocation-calculator.js';

describe('Ledger Event - Contribution Allocation', () => {
  it('distributes contribution to most under-allocated categories first', () => {
    const result = allocationForCategory(3000, [
      { id: 'crypto', deviation: -20 },
      { id: 'fixed_income', deviation: -10 },
      { id: 'real_estate', deviation: -5 },
    ]);

    expect(result).toHaveLength(3);
    expect(result[0].id).toBe('crypto');
    expect(result[0].amount).toBeGreaterThan(result[1].amount);
  });

  it('proportional distribution sums to total amount', () => {
    const result = allocationForCategory(2000, [
      { id: 'cat_a', deviation: -15 },
      { id: 'cat_b', deviation: -25 },
      { id: 'cat_c', deviation: -10 },
    ]);

    const total = result.reduce((s, r) => s + r.amount, 0);

    expect(total).toBeCloseTo(2000, 0);
  });

  it('handles empty input gracefully', () => {
    const result = allocationForCategory(1000, []);

    expect(result).toHaveLength(0);
  });

  it('handles single under-allocated category', () => {
    const result = allocationForCategory(500, [
      { id: 'only_cat', deviation: -50 },
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].amount).toBe(500);
  });

  it('returns empty when total deviation is zero', () => {
    const result = allocationForCategory(1000, [
      { id: 'cat', deviation: 0 },
    ]);

    expect(result).toHaveLength(0);
  });
});
