import { z } from 'zod';

export const assetCategorySchema = z.enum([
  'CRYPTO',
  'FIXED_INCOME',
  'VARIABLE_INCOME',
  'REAL_ESTATE',
]);

export const assetSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  assetType: z.string(),
  category: assetCategorySchema,
  currency: z.string(),
});

export const createAssetSchema = z.object({
  symbol: z.string().min(1),
  name: z.string().min(1),
  assetType: z.string().min(1),
  category: assetCategorySchema,
  currency: z.string().length(3),
});

export type AssetDto = z.infer<typeof assetSchema>;
