import type { AppContext } from '../../../shared/app-context.js';
import { ok } from '../../../shared/kernel/result.js';
import { MarketDataAcl } from './market-data-acl.js';

export class MarketDataService {
  private readonly acl: MarketDataAcl;

  constructor(private readonly ctx: AppContext) {
    this.acl = new MarketDataAcl(ctx);
  }

  async createManualQuote(
    assetId: string,
    price: number,
    currency: string,
    asOf: string,
  ) {
    const db = this.ctx.getUserClient();
    const quote = await db.quote.create({
      data: {
        assetId,
        price,
        currency,
        asOf: new Date(asOf),
        source: 'MANUAL',
      },
    });
    return ok(quote);
  }

  async syncFromBenchmark(assetId: string, ticker: string) {
    const cached = await this.acl.quoteFromBenchmark(ticker, assetId);
    if (!cached.ok || !cached.value) return ok(null);
    const db = this.ctx.getUserClient();
    const asset = await db.asset.findUniqueOrThrow({ where: { id: assetId } });
    const quote = await db.quote.create({
      data: {
        assetId,
        price: cached.value.price,
        currency: asset.currency,
        asOf: new Date(cached.value.asOf),
        source: 'BENCHMARK',
      },
    });
    return ok(quote);
  }

  async setExchangeRate(
    fromCurrency: string,
    toCurrency: string,
    rate: number,
    asOf: string,
    source: 'MANUAL' | 'IMPORT' | 'BENCHMARK',
  ) {
    const db = this.ctx.getUserClient();
    const item = await db.exchangeRate.create({
      data: { fromCurrency, toCurrency, rate, asOf: new Date(asOf), source },
    });
    return ok(item);
  }
}
