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
  baseCurrency: z.string(),
  id: z.string(),
  name: z.string(),
  strategyId: z.string().nullable(),
});

export const createPortfolioSchema = z.object({
  accountIds: z.array(z.string()).optional(),
  baseCurrency: z.string().length(3).default('BRL'),
  name: z.string().min(1),
});

export const createTransactionSchema = z.object({
  accountId: z.string(),
  assetId: z.string(),
  currency: z.string().length(3),
  fees: z.number().nonnegative().default(0),
  fxRate: z.number().positive().optional(),
  quantity: z.number().positive(),
  taxes: z.number().nonnegative().default(0),
  tradeDate: z.string(),
  type: transactionTypeSchema,
  unitPrice: z.number().nonnegative(),
});

export const positionSchema = z.object({
  accountId: z.string(),
  assetId: z.string(),
  averageCost: z.number(),
  costCurrency: z.string(),
  id: z.string(),
  quantity: z.number(),
});

export type PortfolioDto = z.infer<typeof portfolioSchema>;
