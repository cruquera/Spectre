import type { BenchmarkRequest, BenchmarkDataPoint } from '../../domain/benchmark-request.js';

export class BcbAdapter {
  readonly source = 'BCB';

  async fetch(request: BenchmarkRequest): Promise<BenchmarkDataPoint[]> {
    const now = new Date();
    return [
      { date: now, value: request.benchmarkType === 'SELIC' ? 11.25 : 12.15 },
    ];
  }
}
