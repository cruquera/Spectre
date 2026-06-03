import { z } from 'zod';

export const quoteSourceSchema = z.enum(['MANUAL', 'IMPORT', 'BENCHMARK']);

export const createQuoteSchema = z.object({
  asOf: z.string(),
  assetId: z.string(),
  currency: z.string().length(3),
  price: z.number().positive(),
  source: quoteSourceSchema
});

export const exchangeRateSchema = z.object({
  asOf: z.string(),
  fromCurrency: z.string().length(3),
  rate: z.number().positive(),
  source: quoteSourceSchema,
  toCurrency: z.string().length(3)
});
