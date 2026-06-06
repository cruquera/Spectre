import { z } from 'zod';

export const ASSET_TYPES = [
  'STOCKPICKING',
  'CRYPTO',
  'DEBENTURE',
  'INVESTMENT_FUND',
  'PENSION_FUND',
  'FII',
  'ETF',
  'BDR',
  'TREASURY',
] as const;

export const assetTypeSchema = z.enum(ASSET_TYPES);

export const assetTypeLabel: Record<string, string> = {
  STOCKPICKING: 'Ações (Stockpicking)',
  CRYPTO: 'Criptomoedas',
  DEBENTURE: 'Debêntures',
  INVESTMENT_FUND: 'Fundos de Investimento',
  PENSION_FUND: 'Fundos Previdenciários',
  FII: 'FIIs',
  ETF: 'ETFs',
  BDR: 'BDRs',
  TREASURY: 'Tesouro Direto',
};

export const assetSchema = z.object({
  id: z.string(),
  type: assetTypeSchema,
  targetPercentage: z.number().min(0).max(100),
  initialValue: z.number().min(0),
  name: z.string().nullable(),
  portfolioProjectId: z.string(),
});

export const createAssetSchema = z.object({
  type: assetTypeSchema,
  targetPercentage: z.number().min(0).max(100),
  initialValue: z.number().min(0).default(0),
  name: z.string().nullable().optional(),
});

export const portfolioProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  assets: z.array(assetSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createPortfolioProjectSchema = z.object({
  name: z.string().min(1, 'Nome do projeto é obrigatório'),
  assets: z.array(createAssetSchema).min(1, 'Adicione pelo menos um ativo'),
}).refine(
  (data) => {
    const sum = data.assets.reduce((acc, a) => acc + a.targetPercentage, 0);
    return Math.abs(sum - 100) < 0.01;
  },
  { message: 'A soma dos percentuais deve ser exatamente 100%' },
);

export type AssetDto = z.infer<typeof assetSchema>;
export type CreateAssetRequest = z.infer<typeof createAssetSchema>;
export type PortfolioProjectDto = z.infer<typeof portfolioProjectSchema>;
export type CreatePortfolioProjectRequest = z.infer<typeof createPortfolioProjectSchema>;
