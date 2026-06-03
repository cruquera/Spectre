import type { AppContext } from '../../../shared/app-context.js';
import { type Money, convertMoney } from '../../../shared/kernel/money.js';
import { ok } from '../../../shared/kernel/result.js';

export class ValuationService {
  constructor(private readonly ctx: AppContext) {}

  async getPortfolioValue(portfolioId: string, baseCurrency: string) {
    const db = this.ctx.getUserClient();
    const links = await db.portfolioAccount.findMany({ where: { portfolioId } });
    const accountIds = links.map((l) => l.accountId);
    const positions = await db.position.findMany({
      where: { accountId: { in: accountIds } },
      include: { asset: true },
    });

    let total = 0;
    const breakdown: Record<string, number> = {};

    for (const pos of positions) {
      const quote = await db.quote.findFirst({
        where: { assetId: pos.assetId },
        orderBy: { asOf: 'desc' },
      });
      const price = quote?.price ?? pos.averageCost;
      let value: Money = {
        amount: pos.quantity * price,
        currency: quote?.currency ?? pos.costCurrency,
      };

      if (value.currency !== baseCurrency) {
        const fx = await this.getFxRate(value.currency, baseCurrency);

        if (fx) value = convertMoney(value, fx, baseCurrency);
      }
      total += value.amount;
      breakdown[pos.asset.symbol] = (breakdown[pos.asset.symbol] ?? 0) + value.amount;
    }

    return ok({ total, currency: baseCurrency, breakdown });
  }

  private async getFxRate(from: string, to: string): Promise<number | null> {
    const db = this.ctx.getUserClient();
    const rate = await db.exchangeRate.findFirst({
      where: { fromCurrency: from, toCurrency: to },
      orderBy: { asOf: 'desc' },
    });

    return rate?.rate ?? null;
  }
}
