import { z } from 'zod';

import { assetCategorySchema } from './assets.js';

export const categoryAllocationSchema = z.object({
  category: assetCategorySchema,
  deviation: z.number(),
  needsRebalance: z.boolean(),
  realPercent: z.number(),
  targetPercent: z.number().min(0).max(100)
});

export const assetAllocationSchema = z.object({
  assetId: z.string(),
  deviation: z.number(),
  message: z.string(),
  needsRebalance: z.boolean(),
  realPercent: z.number(),
  symbol: z.string(),
  targetPercent: z.number()
});

export const allocationAnalysisSchema = z.object({
  assets: z.array(assetAllocationSchema),
  categories: z.array(categoryAllocationSchema),
  portfolioId: z.string(),
  thresholdPercent: z.number()
});

export const setCategoryAllocationSchema = z.object({
  category: assetCategorySchema,
  portfolioId: z.string(),
  targetPercent: z.number().min(0).max(100)
});

export const setAssetAllocationSchema = z.object({
  assetId: z.string(),
  portfolioId: z.string(),
  targetPercent: z.number().min(0).max(100)
});

export type AllocationAnalysisDto = z.infer<typeof allocationAnalysisSchema>;
