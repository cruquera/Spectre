export type BenchmarkSeries = {
  id: string;
  symbol: string;
  source: string;
  benchmarkType: string;
};

export type BenchmarkDataPoint = {
  id: string;
  seriesId: string;
  date: Date;
  value: number;
};

export type SyncJob = {
  id: string;
  seriesId: string;
  lastSyncAt: Date | null;
  status: string;
  error: string | null;
};
