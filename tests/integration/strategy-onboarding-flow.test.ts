import { createPortfolioTemplateSchema } from '../../data-contracts/src/portfolio-template.js';

describe('Strategy onboarding flow', () => {
  it('creates template with FREE_ALLOCATION by default', () => {
    const result = createPortfolioTemplateSchema.safeParse({
      name: 'Minha Carteira',
      targets: [
        { assetClass: 'crypto', allocationPercentage: 100 },
      ],
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.strategy).toBe('FREE_ALLOCATION');
    }
  });

  it('accepts explicit FREE_ALLOCATION strategy', () => {
    const result = createPortfolioTemplateSchema.safeParse({
      name: 'Teste',
      strategy: 'FREE_ALLOCATION',
      targets: [
        { assetClass: 'crypto', allocationPercentage: 50 },
        { assetClass: 'etf_brazil', allocationPercentage: 50 },
      ],
    });

    expect(result.success).toBe(true);
  });

  it('accepts ASSET_CLASS_ALLOCATION strategy', () => {
    const result = createPortfolioTemplateSchema.safeParse({
      name: 'Teste',
      strategy: 'ASSET_CLASS_ALLOCATION',
      targets: [
        { assetClass: 'crypto', allocationPercentage: 100 },
      ],
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid strategy value', () => {
    const result = createPortfolioTemplateSchema.safeParse({
      name: 'Teste',
      strategy: 'INVALID',
      targets: [
        { assetClass: 'crypto', allocationPercentage: 100 },
      ],
    });

    expect(result.success).toBe(false);
  });

  it('rejects template without name', () => {
    const result = createPortfolioTemplateSchema.safeParse({
      targets: [
        { assetClass: 'crypto', allocationPercentage: 100 },
      ],
    });

    expect(result.success).toBe(false);
  });
});
