import type { AppContext } from '../../../shared/app-context.js';
import { ok } from '../../../shared/kernel/result.js';
import { BenchmarkService } from '../../benchmark/application/benchmark-service.js';

/** Anti-Corruption Layer ??? only passes public benchmark DTOs */
export class MarketDataAcl {
  private readonly benchmark: BenchmarkService;

  constructor(ctx: AppContext) {
    this.benchmark = new BenchmarkService(ctx);
  }

  async quoteFromBenchmark(ticker: string, assetId: string) {
    const result = await this.benchmark.listCached({
  benchmarkType: 'PRICE',
  period: '1M',
  source: 'YAHOO',
  ticker
});

    if (!result.ok || !result.value) {
      return ok(null);
    }
    const latest = result.value.dataPoints.at(-1);

    if (!latest) return ok(null);

    return ok({
  asOf: latest.date,
  assetId,
  price: latest.value,
  source: 'BENCHMARK' as const
});
  }
}
