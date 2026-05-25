/** Public DTO — no user/financial context allowed */
export interface BenchmarkRequest {
  ticker: string;
  period: '1M' | '3M' | '6M' | '1Y' | '5Y' | 'MAX';
  benchmarkType: string;
  source?: 'YAHOO' | 'BCB' | 'IBGE';
}

export interface BenchmarkDataPoint {
  date: Date;
  value: number;
}

export interface BenchmarkSeriesResult {
  symbol: string;
  source: string;
  benchmarkType: string;
  dataPoints: BenchmarkDataPoint[];
}
