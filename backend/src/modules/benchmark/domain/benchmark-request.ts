/** Public DTO — no user/financial context allowed */
export type BenchmarkRequest = {
  ticker: string;
  period: '1M' | '3M' | '6M' | '1Y' | '5Y' | 'MAX';
  benchmarkType: string;
  source?: 'YAHOO' | 'BCB' | 'IBGE';
}

export type BenchmarkDataPoint = {
  date: Date;
  value: number;
}

export type BenchmarkSeriesResult = {
  symbol: string;
  source: string;
  benchmarkType: string;
  dataPoints: BenchmarkDataPoint[];
}
