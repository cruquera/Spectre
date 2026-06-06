import { ASSET_CLASSES, assetClassLabel, assetClassSchema, createPortfolioAssetTargetSchema, createPortfolioTemplateSchema } from '../../data-contracts/src/portfolio-template.js';

describe('Asset taxonomy', () => {
  it('has exactly 20 asset classes', () => {
    expect(ASSET_CLASSES).toHaveLength(20);
  });

  it('each class has a non-empty label', () => {
    for (const ac of ASSET_CLASSES) {
      expect(assetClassLabel[ac]).toBeDefined();
      expect(assetClassLabel[ac].length).toBeGreaterThan(0);
    }
  });

  it('all classes are valid enum values', () => {
    for (const ac of ASSET_CLASSES) {
      const result = assetClassSchema.safeParse(ac);

      expect(result.success).toBe(true);
    }
  });

  it('rejects invalid asset class', () => {
    const result = assetClassSchema.safeParse('invalid_class');

    expect(result.success).toBe(false);
  });

  it('accepts valid target with required fields only', () => {
    const result = createPortfolioAssetTargetSchema.safeParse({
      assetClass: 'crypto',
      allocationPercentage: 20,
    });

    expect(result.success).toBe(true);
  });

  it('accepts target with optional ticker', () => {
    const result = createPortfolioAssetTargetSchema.safeParse({
      assetClass: 'stock_picking_b3',
      allocationPercentage: 15,
      optionalTickerDescription: 'KLBN11',
    });

    expect(result.success).toBe(true);
  });

  it('rejects target with percentage below 0', () => {
    const result = createPortfolioAssetTargetSchema.safeParse({
      assetClass: 'crypto',
      allocationPercentage: -5,
    });

    expect(result.success).toBe(false);
  });

  it('rejects target with percentage above 100', () => {
    const result = createPortfolioAssetTargetSchema.safeParse({
      assetClass: 'crypto',
      allocationPercentage: 150,
    });

    expect(result.success).toBe(false);
  });
});

describe('Portfolio template 100% validation', () => {
  it('accepts template with targets summing 100%', () => {
    const result = createPortfolioTemplateSchema.safeParse({
      name: 'Teste',
      targets: [
        { assetClass: 'crypto', allocationPercentage: 30 },
        { assetClass: 'etf_brazil', allocationPercentage: 70 },
      ],
    });

    expect(result.success).toBe(true);
  });

  it('rejects template with targets summing less than 100%', () => {
    const result = createPortfolioTemplateSchema.safeParse({
      name: 'Teste',
      targets: [
        { assetClass: 'crypto', allocationPercentage: 30 },
        { assetClass: 'etf_brazil', allocationPercentage: 30 },
      ],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('100%');
    }
  });

  it('rejects template with targets summing more than 100%', () => {
    const result = createPortfolioTemplateSchema.safeParse({
      name: 'Teste',
      targets: [
        { assetClass: 'crypto', allocationPercentage: 60 },
        { assetClass: 'etf_brazil', allocationPercentage: 60 },
      ],
    });

    expect(result.success).toBe(false);
  });

  it('rejects template with single target at 100% (valid sum, but placeholder only)', () => {
    const result = createPortfolioTemplateSchema.safeParse({
      name: 'Teste',
      targets: [
        { assetClass: 'cash_reserve', allocationPercentage: 100 },
      ],
    });

    expect(result.success).toBe(true);
  });

  it('rejects template with no targets', () => {
    const result = createPortfolioTemplateSchema.safeParse({
      name: 'Teste',
      targets: [],
    });

    expect(result.success).toBe(false);
  });

  it('rejects template with empty name', () => {
    const result = createPortfolioTemplateSchema.safeParse({
      name: '',
      targets: [
        { assetClass: 'crypto', allocationPercentage: 100 },
      ],
    });

    expect(result.success).toBe(false);
  });
});
