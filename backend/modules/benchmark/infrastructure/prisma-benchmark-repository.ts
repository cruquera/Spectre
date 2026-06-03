import type { PrismaClient as BenchmarkPrismaClient } from '../../../../node_modules/.prisma/benchmark-client/index.js';
import type { BenchmarkRepository } from '../application/benchmark-repository.js';
import type { BenchmarkDataPoint, BenchmarkSeries, SyncJob } from '../domain/benchmark-types.js';

export class PrismaBenchmarkRepository implements BenchmarkRepository {
  public constructor(private readonly db: BenchmarkPrismaClient) {}

  public async upsertSeries(data: {
    benchmarkType: string;
    source: string;
    symbol: string;
  }): Promise<BenchmarkSeries> {
    return this.db.benchmarkSeries.upsert({
      create: data,
      update: {},
      where: {
        symbol_source_benchmarkType: {
          benchmarkType: data.benchmarkType,
          source: data.source,
          symbol: data.symbol,
        },
      },
    });
  }

  public async upsertDataPoint(data: {
    date: Date;
    seriesId: string;
    value: number;
  }): Promise<BenchmarkDataPoint> {
    return this.db.benchmarkDataPoint.upsert({
      create: { date: data.date, seriesId: data.seriesId, value: data.value },
      update: { value: data.value },
      where: {
        seriesId_date: { date: data.date, seriesId: data.seriesId },
      },
    });
  }

  public async findSeriesWithDataPoints(symbol: string, source: string, benchmarkType: string): Promise<{
    id: string;
    symbol: string;
    source: string;
    benchmarkType: string;
    dataPoints: Array<{ date: Date; value: number }>;
  } | null> {
    const result = await this.db.benchmarkSeries.findUnique({
      include: { dataPoints: { orderBy: { date: 'asc' } } },
      where: {
        symbol_source_benchmarkType: {
          benchmarkType,
          source,
          symbol,
        },
      },
    });

    return result;
  }

  public async createSyncJob(data: {
    lastSyncAt: Date;
    seriesId: string;
    status: string;
  }): Promise<SyncJob> {
    return this.db.syncJob.create({ data });
  }
}
