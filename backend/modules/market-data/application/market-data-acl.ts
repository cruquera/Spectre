import type { AppContext } from '../../../shared/app-context.js';
import { BenchmarkService } from '../../benchmark/application/benchmark-service.js';
import { ok } from '../../../shared/kernel/result.js';

/** Anti-Corruption Layer — only passes public benchmark DTOs */
export class MarketDataAcl {
  private readonly benchmark: BenchmarkService;

  constructor(ctx: AppContext) {
    this.benchmark = new BenchmarkService(ctx);
  }

  async quoteFromBenchmark(ticker: string, assetId: string) {
    const result = await this.benchmark.listCached({
      ticker,
      period: '1M',
      benchmarkType: 'PRICE',
      source: 'YAHOO',
    });
    if (!result.ok || !result.value) {
      return ok(null);
    }
    const latest = result.value.dataPoints.at(-1);
    if (!latest) return ok(null);
    return ok({
      assetId,
      price: latest.value,
      asOf: latest.date,
      source: 'BENCHMARK' as const,
    });
  }
}
