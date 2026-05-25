import { z } from 'zod';

export const transactionTypeSchema = z.enum([
  'BUY',
  'SELL',
  'DIVIDEND',
  'INTEREST',
  'TRANSFER_IN',
  'TRANSFER_OUT',
]);

export const portfolioSchema = z.object({
  id: z.string(),
  name: z.string(),
  baseCurrency: z.string(),
  strategyId: z.string().nullable(),
});

export const createPortfolioSchema = z.object({
  name: z.string().min(1),
  baseCurrency: z.string().length(3).default('BRL'),
  accountIds: z.array(z.string()).optional(),
});

export const createTransactionSchema = z.object({
  accountId: z.string(),
  assetId: z.string(),
  type: transactionTypeSchema,
  quantity: z.number().positive(),
  unitPrice: z.number().nonnegative(),
  fees: z.number().nonnegative().default(0),
  taxes: z.number().nonnegative().default(0),
  tradeDate: z.string(),
  currency: z.string().length(3),
  fxRate: z.number().positive().optional(),
});

export const positionSchema = z.object({
  id: z.string(),
  accountId: z.string(),
  assetId: z.string(),
  quantity: z.number(),
  averageCost: z.number(),
  costCurrency: z.string(),
});

export type PortfolioDto = z.infer<typeof portfolioSchema>;
