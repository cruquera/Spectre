import type { BenchmarkDataPoint, BenchmarkSeries, SyncJob } from '../domain/benchmark-types.js';

export type BenchmarkRepository = {
  upsertSeries(data: {
    benchmarkType: string;
    source: string;
    symbol: string;
  }): Promise<BenchmarkSeries>;
  upsertDataPoint(data: {
    date: Date;
    seriesId: string;
    value: number;
  }): Promise<BenchmarkDataPoint>;
  findSeriesWithDataPoints(symbol: string, source: string, benchmarkType: string): Promise<{
    id: string;
    symbol: string;
    source: string;
    benchmarkType: string;
    dataPoints: Array<{ date: Date; value: number }>;
  } | null>;
  createSyncJob(data: {
    lastSyncAt: Date;
    seriesId: string;
    status: string;
  }): Promise<SyncJob>;
}
