import { z } from 'zod';
import { assetCategorySchema } from './assets.js';

export const categoryAllocationSchema = z.object({
  category: assetCategorySchema,
  targetPercent: z.number().min(0).max(100),
  realPercent: z.number(),
  deviation: z.number(),
  needsRebalance: z.boolean(),
});

export const assetAllocationSchema = z.object({
  assetId: z.string(),
  symbol: z.string(),
  targetPercent: z.number(),
  realPercent: z.number(),
  deviation: z.number(),
  message: z.string(),
  needsRebalance: z.boolean(),
});

export const allocationAnalysisSchema = z.object({
  portfolioId: z.string(),
  thresholdPercent: z.number(),
  categories: z.array(categoryAllocationSchema),
  assets: z.array(assetAllocationSchema),
});

export const setCategoryAllocationSchema = z.object({
  portfolioId: z.string(),
  category: assetCategorySchema,
  targetPercent: z.number().min(0).max(100),
});

export const setAssetAllocationSchema = z.object({
  portfolioId: z.string(),
  assetId: z.string(),
  targetPercent: z.number().min(0).max(100),
});

export type AllocationAnalysisDto = z.infer<typeof allocationAnalysisSchema>;
