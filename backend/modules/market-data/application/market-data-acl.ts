import { type Result, ok } from '../../../shared/kernel/result.js';
import { BenchmarkService } from '../../benchmark/application/benchmark-service.js';

export class MarketDataAcl {
  private readonly benchmark: BenchmarkService;

  public constructor(benchmark: BenchmarkService) {
    this.benchmark = benchmark;
  }

  public async quoteFromBenchmark(ticker: string, assetId: string): Promise<Result<{ asOf: string; assetId: string; price: number; source: 'BENCHMARK' } | null, never>> {
    const result = await this.benchmark.listCached({
      benchmarkType: 'PRICE',
      period: '1M',
      source: 'YAHOO',
      ticker,
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
      source: 'BENCHMARK' as const,
    });
  }
}
