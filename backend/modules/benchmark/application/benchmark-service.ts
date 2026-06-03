import type { BenchmarkRepository } from './benchmark-repository.js';
import type { AppContext } from '../../../shared/app-context.js';
import { type Result, ok } from '../../../shared/kernel/result.js';
import type { BenchmarkDataPoint, BenchmarkRequest } from '../domain/benchmark-request.js';
import { BcbAdapter } from '../infrastructure/adapters/bcb-adapter.js';
import { IbgeAdapter } from '../infrastructure/adapters/ibge-adapter.js';
import { YahooFinanceAdapter } from '../infrastructure/adapters/yahoo-adapter.js';

export class BenchmarkService {
  private readonly yahoo = new YahooFinanceAdapter();
  private readonly bcb = new BcbAdapter();
  private readonly ibge = new IbgeAdapter();

  public constructor(
    private readonly ctx: AppContext,
    private readonly repo: BenchmarkRepository,
  ) {}

  public async sync(request: BenchmarkRequest): Promise<Result<{ count: number; symbol: string }, never>> {
    const source = request.source ?? 'YAHOO';
    const points = await this.fetchFromSource(request, source);

    const series = await this.repo.upsertSeries({
      benchmarkType: request.benchmarkType,
      source,
      symbol: request.ticker,
    });

    for (const p of points) {
      await this.repo.upsertDataPoint({
        date: p.date,
        seriesId: series.id,
        value: p.value,
      });
    }

    await this.repo.createSyncJob({
      lastSyncAt: new Date(),
      seriesId: series.id,
      status: 'OK',
    });

    return ok({ count: points.length, symbol: request.ticker });
  }

  public async listCached(request: BenchmarkRequest): Promise<Result<{ benchmarkType: string; dataPoints: Array<{ date: string; value: number }>; source: string; symbol: string } | null, never>> {
    const source = request.source ?? 'YAHOO';
    const series = await this.repo.findSeriesWithDataPoints(request.ticker, source, request.benchmarkType);

    if (!series) return ok(null);

    return ok({
      benchmarkType: series.benchmarkType,
      dataPoints: series.dataPoints.map((d) => ({
        date: d.date.toISOString(),
        value: d.value,
      })),
      source: series.source,
      symbol: series.symbol,
    });
  }

  private async fetchFromSource(request: BenchmarkRequest, source: string): Promise<BenchmarkDataPoint[]> {
    switch (source) {
      case 'BCB':
        return this.bcb.fetch(request);
      case 'IBGE':
        return this.ibge.fetch(request);
      default:
        return this.yahoo.fetch(request);
    }
  }
}
