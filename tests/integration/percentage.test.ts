import { deviation, needsRebalance, percentOf, round2 } from '../../backend/src/shared/kernel/percentage.js';

describe('percentage kernel', () => {
  it('computes percent of total', () => {
    expect(percentOf(25, 100)).toBe(25);
  });

  it('returns 0 when total is 0', () => {
    expect(percentOf(0, 0)).toBe(0);
    expect(percentOf(5, 0)).toBe(0);
  });

  it('computes deviation', () => {
    expect(deviation(10, 7)).toBe(3);
    expect(deviation(5, 10)).toBe(-5);
  });

  it('rounds to 2 decimal places', () => {
    expect(round2(1.234)).toBe(1.23);
    expect(round2(1.235)).toBe(1.24);
  });

  it('detects rebalance threshold', () => {
    expect(needsRebalance(5.1, 5)).toBe(true);
    expect(needsRebalance(4.9, 5)).toBe(false);
  });
});
