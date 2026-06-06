import { PORTFOLIO_STRATEGIES, normalizeAllocation, strategyDescription, strategyLabel } from '../../backend/src/shared/kernel/allocation-tree.js';

describe('Portfolio strategies', () => {
  it('has exactly 2 strategies', () => {
    expect(PORTFOLIO_STRATEGIES).toHaveLength(2);
    expect(PORTFOLIO_STRATEGIES).toContain('FREE_ALLOCATION');
    expect(PORTFOLIO_STRATEGIES).toContain('ASSET_CLASS_ALLOCATION');
  });

  it('each strategy has a label and description', () => {
    for (const s of PORTFOLIO_STRATEGIES) {
      expect(strategyLabel[s]).toBeDefined();
      expect(strategyLabel[s].length).toBeGreaterThan(0);
      expect(strategyDescription[s]).toBeDefined();
      expect(strategyDescription[s].length).toBeGreaterThan(0);
    }
  });
});

describe('Allocation tree - FREE_ALLOCATION', () => {
  it('passes through flat targets', () => {
    const result = normalizeAllocation([
      { assetClass: 'crypto', percentage: 30 },
      { assetClass: 'etf_brazil', percentage: 70 },
    ], 'FREE_ALLOCATION');

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ assetClass: 'crypto', effectivePercentage: 30, optionalTickerDescription: null });
    expect(result[1]).toEqual({ assetClass: 'etf_brazil', effectivePercentage: 70, optionalTickerDescription: null });
  });

  it('preserves ticker descriptions', () => {
    const result = normalizeAllocation([
      { assetClass: 'crypto', percentage: 100, optionalTickerDescription: 'Bitcoin' },
    ], 'FREE_ALLOCATION');

    expect(result[0].optionalTickerDescription).toBe('Bitcoin');
  });

  it('handles empty array', () => {
    const result = normalizeAllocation([], 'FREE_ALLOCATION');

    expect(result).toHaveLength(0);
  });
});

describe('Allocation tree - ASSET_CLASS_ALLOCATION', () => {
  it('flattens hierarchy with percentage calculation', () => {
    const result = normalizeAllocation([
      {
        assetClass: 'crypto',
        percentage: 20,
        children: [
          { assetClass: 'crypto', percentage: 80, optionalTickerDescription: 'Bitcoin' },
          { assetClass: 'crypto', percentage: 20, optionalTickerDescription: 'Ethereum' },
        ],
      },
      { assetClass: 'etf_brazil', percentage: 80 },
    ], 'ASSET_CLASS_ALLOCATION');

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ assetClass: 'crypto', effectivePercentage: 16, optionalTickerDescription: 'Bitcoin' });
    expect(result[1]).toEqual({ assetClass: 'crypto', effectivePercentage: 4, optionalTickerDescription: 'Ethereum' });
    expect(result[2]).toEqual({ assetClass: 'etf_brazil', effectivePercentage: 80, optionalTickerDescription: null });
  });

  it('handles empty children as leaf nodes', () => {
    const result = normalizeAllocation([
      { assetClass: 'crypto', percentage: 100 },
    ], 'ASSET_CLASS_ALLOCATION');

    expect(result).toHaveLength(1);
    expect(result[0].effectivePercentage).toBe(100);
  });
});
