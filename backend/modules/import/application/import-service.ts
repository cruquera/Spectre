import type { AppContext } from '../../../shared/app-context.js';
import { ok } from '../../../shared/kernel/result.js';
import { BenchmarkService } from '../../benchmark/application/benchmark-service.js';

export class ImportService {
  private readonly benchmark: BenchmarkService;

  constructor(private readonly ctx: AppContext) {
    this.benchmark = new BenchmarkService(ctx);
  }

  /** FX via benchmark cache (PTAX/USD tickers) — phase 8 */
  async syncFxFromBenchmark(
    fromCurrency: string,
    toCurrency: string,
    ticker: string,
  ) {
    const result = await this.benchmark.listCached({
      ticker,
      period: '1M',
      benchmarkType: 'FX',
      source: 'BCB',
    });
    if (!result.ok || !result.value?.dataPoints.length) {
      return ok({ synced: false });
    }
    const latest = result.value.dataPoints.at(-1)!;
    const db = this.ctx.getUserClient();
    await db.exchangeRate.create({
      data: {
        fromCurrency,
        toCurrency,
        rate: latest.value,
        asOf: new Date(latest.date),
        source: 'BENCHMARK',
      },
    });
    return ok({ synced: true, rate: latest.value });
  }

  async importQuotesCsv(csvContent: string) {
    const db = this.ctx.getUserClient();
    const lines = csvContent.trim().split('\n').slice(1);
    let count = 0;
    for (const line of lines) {
      const [symbol, price, currency, asOf] = line.split(',').map((s) => s.trim());
      const asset = await db.asset.findFirst({ where: { symbol } });
      if (!asset) continue;
      await db.quote.create({
        data: {
          assetId: asset.id,
          price: parseFloat(price),
          currency: currency || asset.currency,
          asOf: new Date(asOf),
          source: 'IMPORT',
        },
      });
      count++;
    }
    return ok({ imported: count });
  }

  async importOperationsCsv(accountId: string, csvContent: string) {
    const db = this.ctx.getUserClient();
    const lines = csvContent.trim().split('\n').slice(1);
    let count = 0;
    for (const line of lines) {
      const [symbol, type, quantity, unitPrice, tradeDate, currency] = line
        .split(',')
        .map((s) => s.trim());
      const asset = await db.asset.findFirst({ where: { symbol } });
      if (!asset) continue;
      await db.transaction.create({
        data: {
          accountId,
          assetId: asset.id,
          type: type as 'BUY' | 'SELL',
          quantity: parseFloat(quantity),
          unitPrice: parseFloat(unitPrice),
          tradeDate: new Date(tradeDate),
          currency: currency || 'BRL',
        },
      });
      count++;
    }
    return ok({ imported: count });
  }
}
