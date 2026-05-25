import { z } from 'zod';

export const quoteSourceSchema = z.enum(['MANUAL', 'IMPORT', 'BENCHMARK']);

export const createQuoteSchema = z.object({
  assetId: z.string(),
  price: z.number().positive(),
  currency: z.string().length(3),
  asOf: z.string(),
  source: quoteSourceSchema,
});

export const exchangeRateSchema = z.object({
  fromCurrency: z.string().length(3),
  toCurrency: z.string().length(3),
  rate: z.number().positive(),
  asOf: z.string(),
  source: quoteSourceSchema,
});
