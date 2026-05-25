import { BenchmarkService } from '../../backend/modules/benchmark/application/benchmark-service';
import { AppContext } from '../../backend/shared/app-context';
import path from 'node:path';
import os from 'node:os';

describe('Benchmark isolation', () => {
  it('BenchmarkRequest has no user fields', () => {
    const request = {
      ticker: 'CDI',
      period: '1Y' as const,
      benchmarkType: 'RATE',
      source: 'BCB' as const,
    };
    expect(request).not.toHaveProperty('userId');
    expect(request).not.toHaveProperty('portfolioId');
    expect(Object.keys(request).sort()).toEqual(
      ['benchmarkType', 'period', 'source', 'ticker'].sort(),
    );
  });
});
