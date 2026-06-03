import type { ImportRepository } from './import-repository.js';
import type { AppContext } from '../../../shared/app-context.js';
import { type Result, ok } from '../../../shared/kernel/result.js';
import { BenchmarkService } from '../../benchmark/application/benchmark-service.js';

export class ImportService {
  private readonly benchmark: BenchmarkService;

  public constructor(
    private readonly ctx: AppContext,
    private readonly repo: ImportRepository,
    benchmark: BenchmarkService,
  ) {
    this.benchmark = benchmark;
  }

  public async syncFxFromBenchmark(
    fromCurrency: string,
    toCurrency: string,
    ticker: string,
  ): Promise<Result<{ rate?: number; synced: boolean }, never>> {
    const result = await this.benchmark.listCached({
      benchmarkType: 'FX',
      period: '1M',
      source: 'BCB',
      ticker,
    });

    if (!result.ok || !result.value?.dataPoints.length) {
      return ok({ synced: false });
    }
    const latest = result.value.dataPoints.at(-1)!;

    await this.repo.createExchangeRate({
      asOf: new Date(latest.date),
      fromCurrency,
      rate: latest.value,
      source: 'BENCHMARK' as const,
      toCurrency,
    });

    return ok({ rate: latest.value, synced: true });
  }

  public async importQuotesCsv(csvContent: string): Promise<Result<{ imported: number }, never>> {
    const lines = csvContent.trim().split('\n').slice(1);
    let count = 0;

    for (const line of lines) {
      const [symbol, price, currency, asOf] = line.split(',').map((s) => s.trim());
      const asset = await this.repo.findAssetBySymbol(symbol);

      if (!asset) continue;
      await this.repo.createQuote({
        asOf: new Date(asOf),
        assetId: asset.id,
        currency: currency || asset.currency,
        price: parseFloat(price),
        source: 'IMPORT' as const,
      });
      count++;
    }

    return ok({ imported: count });
  }

  public async importOperationsCsv(accountId: string, csvContent: string): Promise<Result<{ imported: number }, never>> {
    const lines = csvContent.trim().split('\n').slice(1);
    let count = 0;

    for (const line of lines) {
      const [symbol, type, quantity, unitPrice, tradeDate, currency] = line
        .split(',')
        .map((s) => s.trim());
      const asset = await this.repo.findAssetBySymbol(symbol);

      if (!asset) continue;
      await this.repo.createTransaction({
        accountId,
        assetId: asset.id,
        currency: currency || 'BRL',
        quantity: parseFloat(quantity),
        tradeDate: new Date(tradeDate),
        type: type as 'BUY' | 'SELL',
        unitPrice: parseFloat(unitPrice),
      });
      count++;
    }

    return ok({ imported: count });
  }
}
