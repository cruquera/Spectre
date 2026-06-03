import type { AppContext } from '../../../shared/app-context.js';
import { ok } from '../../../shared/kernel/result.js';
import { BenchmarkService } from '../../benchmark/application/benchmark-service.js';

export class ImportService {
  private readonly benchmark: BenchmarkService;

  constructor(private readonly ctx: AppContext) {
    this.benchmark = new BenchmarkService(ctx);
  }

  /** FX via benchmark cache (PTAX/USD tickers) ??? phase 8 */
  async syncFxFromBenchmark(
    fromCurrency: string,
    toCurrency: string,
    ticker: string,
  ) {
    const result = await this.benchmark.listCached({
  benchmarkType: 'FX',
  period: '1M',
  source: 'BCB',
  ticker
});

    if (!result.ok || !result.value?.dataPoints.length) {
      return ok({ synced: false });
    }
    const latest = result.value.dataPoints.at(-1)!;
    const db = this.ctx.getUserClient();

    await db.exchangeRate.create({
      data: {
  asOf: new Date(latest.date),
  fromCurrency,
  rate: latest.value,
  source: 'BENCHMARK',
  toCurrency
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
  asOf: new Date(asOf),
  assetId: asset.id,
  currency: currency || asset.currency,
  price: parseFloat(price),
  source: 'IMPORT'
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
  currency: currency || 'BRL',
  quantity: parseFloat(quantity),
  tradeDate: new Date(tradeDate),
  type: type as 'BUY' | 'SELL',
  unitPrice: parseFloat(unitPrice)
},
      });
      count++;
    }

    return ok({ imported: count });
  }
}
