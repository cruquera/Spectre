import type { BenchmarkDataPoint, BenchmarkRequest } from '../../domain/benchmark-request.js';

export class BcbAdapter {
  readonly source = 'BCB';

  fetch(request: BenchmarkRequest): Promise<BenchmarkDataPoint[]> {
    const now = new Date();

    return Promise.resolve([
      { date: now, value: request.benchmarkType === 'SELIC' ? 11.25 : 12.15 },
    ]);
  }
}
