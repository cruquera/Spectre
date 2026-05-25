import { z } from 'zod';

export const benchmarkRequestSchema = z.object({
  ticker: z.string().min(1),
  period: z.enum(['1M', '3M', '6M', '1Y', '5Y', 'MAX']),
  benchmarkType: z.string(),
  source: z.enum(['YAHOO', 'BCB', 'IBGE']).optional(),
});

export const benchmarkDataPointSchema = z.object({
  date: z.string(),
  value: z.number(),
});

export const benchmarkSeriesSchema = z.object({
  symbol: z.string(),
  source: z.string(),
  benchmarkType: z.string(),
  dataPoints: z.array(benchmarkDataPointSchema),
});

export type BenchmarkRequest = z.infer<typeof benchmarkRequestSchema>;
