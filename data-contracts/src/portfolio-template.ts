import { z } from 'zod';

export const ASSET_CLASSES = [
  'cash_reserve',
  'fixed_income_post',
  'fixed_income_pre',
  'fixed_income_inflation',
  'debentures',
  'investment_funds',
  'retirement_funds',
  'real_estate_funds',
  'etf_brazil',
  'etf_global',
  'stock_picking_b3',
  'stock_picking_nasdaq',
  'stock_picking_nyse',
  'stock_picking_europe',
  'stock_picking_asia',
  'reits',
  'commodities',
  'precious_metals',
  'crypto',
  'alternative_assets',
] as const;

export const assetClassSchema = z.enum(ASSET_CLASSES);

export const assetClassLabel: Record<string, string> = {
  cash_reserve: 'Caixa e Reserva',
  fixed_income_post: 'Renda Fixa Pós-Fixada',
  fixed_income_pre: 'Renda Fixa Prefixada',
  fixed_income_inflation: 'Renda Fixa IPCA+',
  debentures: 'Debêntures',
  investment_funds: 'Fundos de Investimento',
  retirement_funds: 'Fundos Previdenciários',
  real_estate_funds: 'Fundos Imobiliários (FII)',
  etf_brazil: 'ETF Brasil',
  etf_global: 'ETF Internacional',
  stock_picking_b3: 'Stock Picking B3 (IBOVESPA)',
  stock_picking_nasdaq: 'Stock Picking NASDAQ',
  stock_picking_nyse: 'Stock Picking NYSE',
  stock_picking_europe: 'Stock Picking Europa',
  stock_picking_asia: 'Stock Picking Ásia',
  reits: 'REITs',
  commodities: 'Commodities',
  precious_metals: 'Ouro e Metais Preciosos',
  crypto: 'Criptomoedas',
  alternative_assets: 'Ativos Alternativos',
};

export const BENCHMARKS = ['SP500', 'CDI', 'IPCA', 'IBOVESPA', 'NASDAQ100', 'BITCOIN'] as const;

export const benchmarkSchema = z.enum(BENCHMARKS);

export const benchmarkLabel: Record<string, string> = {
  SP500: 'S&P 500',
  CDI: 'CDI',
  IPCA: 'IPCA',
  IBOVESPA: 'Ibovespa',
  NASDAQ100: 'Nasdaq 100',
  BITCOIN: 'Bitcoin',
};

export const investmentRulesSchema = z.object({
  fractionalAllowed: z.boolean().optional(),
  lotSize: z.number().int().min(0).optional(),
  minimumInvestment: z.number().min(0).optional(),
});

export const portfolioAssetTargetSchema = z.object({
  allocationPercentage: z.number().min(0).max(100),
  assetClass: assetClassSchema,
  fractionalAllowed: z.boolean(),
  id: z.string(),
  investmentRules: investmentRulesSchema.optional(),
  lotSize: z.number().int().min(0),
  minimumInvestment: z.number().min(0),
  optionalTickerDescription: z.string().nullable(),
  templateId: z.string(),
});

export const createPortfolioAssetTargetSchema = z.object({
  allocationPercentage: z.number().min(0).max(100),
  assetClass: assetClassSchema,
  classTargetId: z.string().nullable().optional(),
  fractionalAllowed: z.boolean().optional().default(true),
  lotSize: z.number().int().min(0).optional().default(1),
  minimumInvestment: z.number().min(0).optional().default(0),
  optionalTickerDescription: z.string().nullable().optional(),
});

export const portfolioTemplateSchema = z.object({
  baseCurrency: z.string(),
  benchmark: z.string().nullable(),
  createdAt: z.string(),
  description: z.string().nullable(),
  id: z.string(),
  isDefault: z.boolean(),
  name: z.string(),
  strategy: z.string(),
  targets: z.array(portfolioAssetTargetSchema),
  updatedAt: z.string(),
});

export const PORTFOLIO_STRATEGIES = ['FREE_ALLOCATION', 'ASSET_CLASS_ALLOCATION'] as const;

export const portfolioStrategySchema = z.enum(PORTFOLIO_STRATEGIES);

export const portfolioStrategyLabel: Record<string, string> = {
  FREE_ALLOCATION: 'Livre (Recomendado)',
  ASSET_CLASS_ALLOCATION: 'Por Classe de Ativo',
};

export const portfolioStrategyDescription: Record<string, string> = {
  FREE_ALLOCATION: 'Defina diretamente o percentual de cada investimento da carteira.',
  ASSET_CLASS_ALLOCATION: 'Defina categorias e depois distribua os ativos dentro delas.',
};

export const createPortfolioTemplateSchema = z.object({
  baseCurrency: z.string().optional().default('BRL'),
  benchmark: benchmarkSchema.nullable().optional(),
  description: z.string().nullable().optional(),
  isDefault: z.boolean().optional().default(false),
  name: z.string().min(1, 'Nome do projeto é obrigatório'),
  strategy: portfolioStrategySchema.optional().default('FREE_ALLOCATION'),
  targets: z.array(createPortfolioAssetTargetSchema).min(1, 'Adicione pelo menos um ativo'),
})
  .refine(
    (data) => {
      const sum = data.targets.reduce((acc, a) => acc + a.allocationPercentage, 0);

      return Math.abs(sum - 100) < 0.01;
    },
    { message: 'A soma dos percentuais deve ser exatamente 100%' },
  );

export type PortfolioAssetTargetDto = z.infer<typeof portfolioAssetTargetSchema>;
export type CreatePortfolioAssetTargetRequest = z.infer<typeof createPortfolioAssetTargetSchema>;
export type PortfolioTemplateDto = z.infer<typeof portfolioTemplateSchema>;
export type CreatePortfolioTemplateRequest = z.infer<typeof createPortfolioTemplateSchema>;
export type PortfolioStrategyValue = z.infer<typeof portfolioStrategySchema>;
