import { z } from 'zod';

export const benchmarkRequestSchema = z.object({
  benchmarkType: z.string(),
  period: z.enum(['1M', '3M', '6M', '1Y', '5Y', 'MAX']),
  source: z.enum(['YAHOO', 'BCB', 'IBGE']).optional(),
  ticker: z.string().min(1)
});

export const benchmarkDataPointSchema = z.object({
  date: z.string(),
  value: z.number(),
});

export const benchmarkSeriesSchema = z.object({
  benchmarkType: z.string(),
  dataPoints: z.array(benchmarkDataPointSchema),
  source: z.string(),
  symbol: z.string()
});

export type BenchmarkRequest = z.infer<typeof benchmarkRequestSchema>;
