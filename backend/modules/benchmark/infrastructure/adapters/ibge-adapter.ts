import type { BenchmarkDataPoint, BenchmarkRequest } from '../../domain/benchmark-request.js';

export class IbgeAdapter {
  public readonly source = 'IBGE';

  public fetch(_request: BenchmarkRequest): Promise<BenchmarkDataPoint[]> {
    const now = new Date();

    return Promise.resolve([{ date: now, value: 4.5 }]);
  }
}
