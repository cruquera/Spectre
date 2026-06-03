import type { AppContext } from '../../../shared/app-context.js';
import { ok } from '../../../shared/kernel/result.js';
import type { BenchmarkRequest } from '../domain/benchmark-request.js';
import { BcbAdapter } from '../infrastructure/adapters/bcb-adapter.js';
import { IbgeAdapter } from '../infrastructure/adapters/ibge-adapter.js';
import { YahooFinanceAdapter } from '../infrastructure/adapters/yahoo-adapter.js';

export class BenchmarkService {
  private readonly yahoo = new YahooFinanceAdapter();
  private readonly bcb = new BcbAdapter();
  private readonly ibge = new IbgeAdapter();

  constructor(private readonly ctx: AppContext) {}

  async sync(request: BenchmarkRequest) {
    const db = this.ctx.getBenchmarkClient();
    const source = request.source ?? 'YAHOO';
    const points = await this.fetchFromSource(request, source);

    const series = await db.benchmarkSeries.upsert({
      where: {
        symbol_source_benchmarkType: {
  benchmarkType: request.benchmarkType,
  source,
  symbol: request.ticker
},
      },
      create: {
  benchmarkType: request.benchmarkType,
  source,
  symbol: request.ticker
},
      update: {},
    });

    for (const p of points) {
      await db.benchmarkDataPoint.upsert({
        where: {
          seriesId_date: { seriesId: series.id, date: p.date },
        },
        create: { seriesId: series.id, date: p.date, value: p.value },
        update: { value: p.value },
      });
    }

    await db.syncJob.create({
      data: { seriesId: series.id, lastSyncAt: new Date(), status: 'OK' },
    });

    return ok({ symbol: request.ticker, count: points.length });
  }

  async listCached(request: BenchmarkRequest) {
    const db = this.ctx.getBenchmarkClient();
    const source = request.source ?? 'YAHOO';
    const series = await db.benchmarkSeries.findUnique({
      where: {
        symbol_source_benchmarkType: {
  benchmarkType: request.benchmarkType,
  source,
  symbol: request.ticker
},
      },
      include: { dataPoints: { orderBy: { date: 'asc' } } },
    });

    if (!series) return ok(null);

    return ok({
  benchmarkType: series.benchmarkType,
  dataPoints: series.dataPoints.map((d) => ({
  date: d.date.toISOString(),
  value: d.value
})),
  source: series.source,
  symbol: series.symbol
});
  }

  private async fetchFromSource(request: BenchmarkRequest, source: string) {
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
