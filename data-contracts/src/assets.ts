import { z } from 'zod';

export const assetCategorySchema = z.enum([
  'CRYPTO',
  'FIXED_INCOME',
  'VARIABLE_INCOME',
  'REAL_ESTATE',
]);

export const assetSchema = z.object({
  assetType: z.string(),
  category: assetCategorySchema,
  currency: z.string(),
  id: z.string(),
  name: z.string(),
  symbol: z.string(),
});

export const createAssetSchema = z.object({
  assetType: z.string().min(1),
  category: assetCategorySchema,
  currency: z.string().length(3),
  name: z.string().min(1),
  symbol: z.string().min(1),
});

export type AssetDto = z.infer<typeof assetSchema>;
