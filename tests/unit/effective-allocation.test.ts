import { normalizeAllocation } from '../../backend/src/shared/kernel/allocation-tree.js';

function computeEffectivePreview(targets: Array<{
  assetClass: string;
  allocationPercentage: number;
  optionalTickerDescription?: string | null;
  subTargets?: Array<{
    assetClass: string;
    allocationPercentage: number;
    optionalTickerDescription?: string | null;
  }>;
}>, strategy: string): Array<{ label: string; pct: number }> {
  if (strategy === 'FREE_ALLOCATION' || targets.length === 0) return [];
  const result: Array<{ label: string; pct: number }> = [];

  for (const t of targets) {
    if (t.subTargets && t.subTargets.length > 0) {
      for (const st of t.subTargets) {
        const effective = (t.allocationPercentage / 100) * st.allocationPercentage;

        result.push({ label: st.optionalTickerDescription || t.assetClass, pct: effective });
      }
    }
  }

  return result;
}

describe('Effective allocation preview', () => {
  it('returns empty for FREE_ALLOCATION', () => {
    const result = computeEffectivePreview([
      { assetClass: 'crypto', allocationPercentage: 50 },
      { assetClass: 'etf_brazil', allocationPercentage: 50 },
    ], 'FREE_ALLOCATION');

    expect(result).toHaveLength(0);
  });

  it('returns effective percentages for ASSET_CLASS_ALLOCATION', () => {
    const result = computeEffectivePreview([
      {
        assetClass: 'crypto',
        allocationPercentage: 20,
        subTargets: [
          { assetClass: 'crypto', allocationPercentage: 80, optionalTickerDescription: 'Bitcoin' },
          { assetClass: 'crypto', allocationPercentage: 20, optionalTickerDescription: 'Ethereum' },
        ],
      },
      { assetClass: 'etf_brazil', allocationPercentage: 80 },
    ], 'ASSET_CLASS_ALLOCATION');

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ label: 'Bitcoin', pct: 16 });
    expect(result[1]).toEqual({ label: 'Ethereum', pct: 4 });
  });

  it('handles targets with subTargets and standalone targets mixed', () => {
    const result = computeEffectivePreview([
      {
        assetClass: 'crypto',
        allocationPercentage: 30,
        subTargets: [
          { assetClass: 'crypto', allocationPercentage: 100, optionalTickerDescription: 'Bitcoin' },
        ],
      },
      { assetClass: 'cash_reserve', allocationPercentage: 70 },
    ], 'ASSET_CLASS_ALLOCATION');

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ label: 'Bitcoin', pct: 30 });
  });

  it('returns empty for empty targets', () => {
    expect(computeEffectivePreview([], 'ASSET_CLASS_ALLOCATION')).toHaveLength(0);
    expect(computeEffectivePreview([], 'FREE_ALLOCATION')).toHaveLength(0);
  });

  it('returns empty for ASSET_CLASS_ALLOCATION with no subTargets', () => {
    const result = computeEffectivePreview([
      { assetClass: 'crypto', allocationPercentage: 100 },
    ], 'ASSET_CLASS_ALLOCATION');

    expect(result).toHaveLength(0);
  });
});

describe('normalizeAllocation integration', () => {
  it('normalizeAllocation accepts valid FREE_ALLOCATION input', () => {
    const result = normalizeAllocation([
      { assetClass: 'crypto', percentage: 30 },
      { assetClass: 'etf_brazil', percentage: 70 },
    ], 'FREE_ALLOCATION');

    expect(result).toHaveLength(2);
  });

  it('normalizeAllocation handles ASSET_CLASS_ALLOCATION with children', () => {
    const result = normalizeAllocation([
      {
        assetClass: 'crypto',
        percentage: 20,
        children: [
          { assetClass: 'crypto', percentage: 50, optionalTickerDescription: 'Bitcoin' },
          { assetClass: 'crypto', percentage: 50, optionalTickerDescription: 'Ethereum' },
        ],
      },
      { assetClass: 'fixed_income_post', percentage: 80 },
    ], 'ASSET_CLASS_ALLOCATION');

    expect(result).toHaveLength(3);
    expect(result[0].effectivePercentage).toBe(10);
    expect(result[1].effectivePercentage).toBe(10);
    expect(result[2].effectivePercentage).toBe(80);
  });
});
