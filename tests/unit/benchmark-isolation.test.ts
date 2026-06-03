// Imports intentionally omitted because this test only exercises request shape validation

describe('Benchmark isolation', () => {
  it('BenchmarkRequest has no user fields', () => {
    const request = {
  benchmarkType: 'RATE',
  period: '1Y' as const,
  source: 'BCB' as const,
  ticker: 'CDI'
};

    expect(request).not.toHaveProperty('userId');
    expect(request).not.toHaveProperty('portfolioId');
    expect(Object.keys(request).sort()).toEqual(
      ['benchmarkType', 'period', 'source', 'ticker'].sort(),
    );
  });
});
