import { MarketDataAcl } from './market-data-acl.js';
import type { MarketDataRepository } from './market-data-repository.js';
import type { AppContext } from '../../../shared/app-context.js';
import { type Result, ok } from '../../../shared/kernel/result.js';
import { BenchmarkService } from '../../benchmark/application/benchmark-service.js';
import type { ExchangeRate } from '../domain/exchange-rate.js';
import type { Quote } from '../domain/quote.js';

export class MarketDataService {
  private readonly acl: MarketDataAcl;

  public constructor(
    private readonly ctx: AppContext,
    private readonly repo: MarketDataRepository,
    benchmark: BenchmarkService,
  ) {
    this.acl = new MarketDataAcl(benchmark);
  }

  public async createManualQuote(
    assetId: string,
    price: number,
    currency: string,
    asOf: string,
  ): Promise<Result<Quote, never>> {
    const quote = await this.repo.createQuote({
      asOf: new Date(asOf),
      assetId,
      currency,
      price,
      source: 'MANUAL',
    });

    return ok(quote);
  }

  public async syncFromBenchmark(assetId: string, ticker: string): Promise<Result<Quote | null, never>> {
    const cached = await this.acl.quoteFromBenchmark(ticker, assetId);

    if (!cached.ok || !cached.value) return ok(null);
    const db = this.ctx.getUserClient();
    const asset = await db.asset.findUniqueOrThrow({ where: { id: assetId } });
    const quote = await this.repo.createQuote({
      asOf: new Date(cached.value.asOf),
      assetId,
      currency: asset.currency,
      price: cached.value.price,
      source: 'BENCHMARK',
    });

    return ok(quote);
  }

  public async setExchangeRate(
    fromCurrency: string,
    toCurrency: string,
    rate: number,
    asOf: string,
    source: 'MANUAL' | 'IMPORT' | 'BENCHMARK',
  ): Promise<Result<ExchangeRate, never>> {
    const item = await this.repo.setExchangeRate({
      asOf: new Date(asOf),
      fromCurrency,
      rate,
      source,
      toCurrency,
    });

    return ok(item);
  }
}
