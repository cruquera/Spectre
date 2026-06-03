import type { ValuationRepository } from './valuation-repository.js';
import type { AppContext } from '../../../shared/app-context.js';
import { type Money, convertMoney } from '../../../shared/kernel/money.js';
import { type Result, ok } from '../../../shared/kernel/result.js';

export class ValuationService {
  public constructor(
    private readonly ctx: AppContext,
    private readonly repo: ValuationRepository,
  ) {}

  public async getPortfolioValue(portfolioId: string, baseCurrency: string): Promise<Result<{ breakdown: Record<string, number>; currency: string; total: number }, never>> {
    const accountIds = await this.repo.findAccountIdsByPortfolio(portfolioId);
    const positions = await this.repo.findPositionsWithAssets(accountIds);

    let total = 0;
    const breakdown: Record<string, number> = {};

    for (const pos of positions) {
      const quote = await this.repo.findLatestQuote(pos.assetId);
      const price = quote?.price ?? pos.averageCost;
      let value: Money = {
        amount: pos.quantity * price,
        currency: quote?.currency ?? pos.costCurrency,
      };

      if (value.currency !== baseCurrency) {
        const fx = await this.repo.findLatestExchangeRate(value.currency, baseCurrency);

        if (fx) value = convertMoney(value, fx.rate, baseCurrency);
      }
      total += value.amount;
      breakdown[pos.asset.symbol] = (breakdown[pos.asset.symbol] ?? 0) + value.amount;
    }

    return ok({ breakdown, currency: baseCurrency, total });
  }
}
