import { needsRebalance, percentOf } from '../../backend/shared/kernel/percentage';

describe('percentage kernel', () => {
  it('computes percent of total', () => {
    expect(percentOf(25, 100)).toBe(25);
  });

  it('detects rebalance threshold', () => {
    expect(needsRebalance(5.1, 5)).toBe(true);
    expect(needsRebalance(4.9, 5)).toBe(false);
  });
});
