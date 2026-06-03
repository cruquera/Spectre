import type { BenchmarkDataPoint, BenchmarkRequest } from '../../domain/benchmark-request.js';

/** Mock-friendly adapter ??? production fetches Yahoo Finance public API */
export class YahooFinanceAdapter {
  readonly source = 'YAHOO';

  fetch(request: BenchmarkRequest): Promise<BenchmarkDataPoint[]> {
    const days = periodToDays(request.period);
    const points: BenchmarkDataPoint[] = [];
    const base = 100;

    for (let i = days; i >= 0; i--) {
      const d = new Date();

      d.setDate(d.getDate() - i);
      points.push({
        date: d,
        value: base + Math.sin(i / 10) * 5 + (days - i) * 0.1,
      });
    }

    return Promise.resolve(points);
  }
}

function periodToDays(period: BenchmarkRequest['period']): number {
  const map: Record<string, number> = {
  '1M': 30,
  '1Y': 365,
  '3M': 90,
  '5Y': 365 * 5,
  '6M': 180,
  MAX: 365 * 10
};

  return map[period] ?? 365;
}
