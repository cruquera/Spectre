import { z } from 'zod';

export const investmentBlockSchema = z.object({
  assetIds: z.array(z.string()),
  id: z.string(),
  name: z.string(),
});

export const monthlyBlockScheduleSchema = z.object({
  blockId: z.string(),
  month: z.number().int().min(1).max(12),
  year: z.number().int(),
});

export const createInvestmentBlockSchema = z.object({
  assetIds: z.array(z.string()).min(1),
  name: z.string().min(1),
});

export const setMonthlyBlockSchema = z.object({
  blockId: z.string(),
  month: z.number().int().min(1).max(12),
  year: z.number().int(),
});

export const simulateContributionSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().length(3),
  month: z.number().int().min(1).max(12),
  portfolioId: z.string(),
  year: z.number().int(),
});

export const contributionSuggestionSchema = z.object({
  assetId: z.string(),
  rationale: z.string(),
  suggestedAmount: z.number(),
  symbol: z.string(),
});

export type ContributionSuggestionDto = z.infer<typeof contributionSuggestionSchema>;
