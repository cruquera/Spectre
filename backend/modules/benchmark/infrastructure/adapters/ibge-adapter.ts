import type { BenchmarkRequest, BenchmarkDataPoint } from '../../domain/benchmark-request.js';

export class IbgeAdapter {
  readonly source = 'IBGE';

  async fetch(request: BenchmarkRequest): Promise<BenchmarkDataPoint[]> {
    const now = new Date();
    return [{ date: now, value: 4.5 }];
  }
}
