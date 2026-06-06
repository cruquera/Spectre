import {
  BENCHMARKS,
  PORTFOLIO_STRATEGIES,
  benchmarkLabel,
  benchmarkSchema,
  createPortfolioAssetTargetSchema,
  createPortfolioTemplateSchema,
  portfolioStrategyLabel,
  portfolioStrategySchema,
} from '../../data-contracts/src/portfolio-template.js';

describe('BenchmarkType validation', () => {
  it('has exactly 6 benchmarks', () => {
    expect(BENCHMARKS).toHaveLength(6);
    expect(BENCHMARKS).toContain('SP500');
    expect(BENCHMARKS).toContain('CDI');
    expect(BENCHMARKS).toContain('IPCA');
    expect(BENCHMARKS).toContain('IBOVESPA');
    expect(BENCHMARKS).toContain('NASDAQ100');
    expect(BENCHMARKS).toContain('BITCOIN');
  });

  it('each benchmark has a non-empty label', () => {
    for (const b of BENCHMARKS) {
      expect(benchmarkLabel[b]).toBeDefined();
      expect(benchmarkLabel[b].length).toBeGreaterThan(0);
    }
  });

  it('all benchmarks are valid enum values', () => {
    for (const b of BENCHMARKS) {
      expect(benchmarkSchema.safeParse(b).success).toBe(true);
    }
  });

  it('rejects invalid benchmark', () => {
    expect(benchmarkSchema.safeParse('S&P500').success).toBe(false);
    expect(benchmarkSchema.safeParse('INVALID').success).toBe(false);
  });
});

describe('PortfolioStrategy validation', () => {
  it('has exactly 2 strategies', () => {
    expect(PORTFOLIO_STRATEGIES).toHaveLength(2);
    expect(PORTFOLIO_STRATEGIES).toContain('FREE_ALLOCATION');
    expect(PORTFOLIO_STRATEGIES).toContain('ASSET_CLASS_ALLOCATION');
  });

  it('each strategy has a non-empty label', () => {
    for (const s of PORTFOLIO_STRATEGIES) {
      expect(portfolioStrategyLabel[s]).toBeDefined();
      expect(portfolioStrategyLabel[s].length).toBeGreaterThan(0);
    }
  });

  it('all strategies are valid enum values', () => {
    for (const s of PORTFOLIO_STRATEGIES) {
      expect(portfolioStrategySchema.safeParse(s).success).toBe(true);
    }
  });

  it('rejects invalid strategy', () => {
    expect(portfolioStrategySchema.safeParse('HYBRID').success).toBe(false);
  });
});

describe('Target schema with classTargetId', () => {
  it('accepts target without classTargetId', () => {
    const result = createPortfolioAssetTargetSchema.safeParse({
      assetClass: 'crypto',
      allocationPercentage: 20,
    });

    expect(result.success).toBe(true);
  });

  it('accepts target with classTargetId', () => {
    const result = createPortfolioAssetTargetSchema.safeParse({
      assetClass: 'crypto',
      allocationPercentage: 20,
      classTargetId: 'parent-uuid',
    });

    expect(result.success).toBe(true);
  });

  it('accepts target with null classTargetId', () => {
    const result = createPortfolioAssetTargetSchema.safeParse({
      assetClass: 'crypto',
      allocationPercentage: 20,
      classTargetId: null,
    });

    expect(result.success).toBe(true);
  });
});

describe('Template schema with new fields', () => {
  it('accepts template with all new fields', () => {
    const result = createPortfolioTemplateSchema.safeParse({
      name: 'Growth Global',
      description: 'Carteira focada em crescimento global',
      strategy: 'FREE_ALLOCATION',
      benchmark: 'SP500',
      baseCurrency: 'USD',
      isDefault: true,
      targets: [
        { assetClass: 'stock_picking_nasdaq', allocationPercentage: 60 },
        { assetClass: 'crypto', allocationPercentage: 40 },
      ],
    });

    expect(result.success).toBe(true);
  });

  it('accepts template with ASSET_CLASS_ALLOCATION and classTargetId on targets', () => {
    const result = createPortfolioTemplateSchema.safeParse({
      name: 'Carteira Balanceada',
      strategy: 'ASSET_CLASS_ALLOCATION',
      benchmark: 'CDI',
      targets: [
        { assetClass: 'fixed_income_post', allocationPercentage: 50, classTargetId: 'parent-1' },
        { assetClass: 'fixed_income_post', allocationPercentage: 50, classTargetId: 'parent-1', optionalTickerDescription: 'Tesouro Selic' },
      ],
    });

    expect(result.success).toBe(true);
  });

  it('accepts template with minimal fields (defaults applied)', () => {
    const result = createPortfolioTemplateSchema.safeParse({
      name: 'Minima',
      targets: [
        { assetClass: 'crypto', allocationPercentage: 100 },
      ],
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.strategy).toBe('FREE_ALLOCATION');
      expect(result.data.baseCurrency).toBe('BRL');
      expect(result.data.isDefault).toBe(false);
      expect(result.data.benchmark).toBeUndefined();
      expect(result.data.description).toBeUndefined();
    }
  });

  it('rejects template with invalid strategy', () => {
    const result = createPortfolioTemplateSchema.safeParse({
      name: 'Invalido',
      strategy: 'HYBRID',
      targets: [
        { assetClass: 'crypto', allocationPercentage: 100 },
      ],
    });

    expect(result.success).toBe(false);
  });

  it('rejects template with invalid benchmark', () => {
    const result = createPortfolioTemplateSchema.safeParse({
      name: 'Invalido',
      benchmark: 'DOGE',
      targets: [
        { assetClass: 'crypto', allocationPercentage: 100 },
      ],
    });

    expect(result.success).toBe(false);
  });

  it('validates nested target classTargetId with template 100% sum', () => {
    const result = createPortfolioTemplateSchema.safeParse({
      name: 'Hierarquico',
      strategy: 'ASSET_CLASS_ALLOCATION',
      targets: [
        { assetClass: 'crypto', allocationPercentage: 30, classTargetId: 'parent-1' },
        { assetClass: 'crypto', allocationPercentage: 70, classTargetId: 'parent-1', optionalTickerDescription: 'Bitcoin' },
      ],
    });

    expect(result.success).toBe(true);
  });
});
