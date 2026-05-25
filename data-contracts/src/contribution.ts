import { z } from 'zod';

export const investmentBlockSchema = z.object({
  id: z.string(),
  name: z.string(),
  assetIds: z.array(z.string()),
});

export const monthlyBlockScheduleSchema = z.object({
  year: z.number().int(),
  month: z.number().int().min(1).max(12),
  blockId: z.string(),
});

export const createInvestmentBlockSchema = z.object({
  name: z.string().min(1),
  assetIds: z.array(z.string()).min(1),
});

export const setMonthlyBlockSchema = z.object({
  year: z.number().int(),
  month: z.number().int().min(1).max(12),
  blockId: z.string(),
});

export const simulateContributionSchema = z.object({
  portfolioId: z.string(),
  amount: z.number().positive(),
  currency: z.string().length(3),
  year: z.number().int(),
  month: z.number().int().min(1).max(12),
});

export const contributionSuggestionSchema = z.object({
  assetId: z.string(),
  symbol: z.string(),
  suggestedAmount: z.number(),
  rationale: z.string(),
});

export type ContributionSuggestionDto = z.infer<typeof contributionSuggestionSchema>;
