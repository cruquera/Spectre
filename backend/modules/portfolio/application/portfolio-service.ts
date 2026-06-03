import type { AppContext } from '../../../shared/app-context.js';
import { ok } from '../../../shared/kernel/result.js';

export class PortfolioService {
  constructor(private readonly ctx: AppContext) {}

  async list() {
    const db = this.ctx.getUserClient();
    const items = await db.portfolio.findMany({ orderBy: { name: 'asc' } });

    return ok(items);
  }

  async create(name: string, baseCurrency: string, accountIds?: string[]) {
    const db = this.ctx.getUserClient();
    const portfolio = await db.portfolio.create({
      data: { name, baseCurrency },
    });

    if (accountIds?.length) {
      await db.portfolioAccount.createMany({
        data: accountIds.map((accountId) => ({
  accountId,
  portfolioId: portfolio.id
})),
      });
    }

    return ok(portfolio);
  }

  async createTransaction(data: {
    accountId: string;
    assetId: string;
    type: string;
    quantity: number;
    unitPrice: number;
    fees: number;
    taxes: number;
    tradeDate: string;
    currency: string;
    fxRate?: number;
  }) {
    const db = this.ctx.getUserClient();
    const tx = await db.transaction.create({
      data: {
  ...data,
  tradeDate: new Date(data.tradeDate),
  type: data.type as 'BUY' | 'SELL'
},
    });

    await this.updatePosition(data.accountId, data.assetId, data.type, data.quantity, data.unitPrice, data.currency);

    return ok(tx);
  }

  async listPositions(accountId?: string) {
    const db = this.ctx.getUserClient();
    const items = await db.position.findMany({
      where: accountId ? { accountId } : undefined,
      include: { asset: true },
    });

    return ok(items);
  }

  private async updatePosition(
    accountId: string,
    assetId: string,
    type: string,
    quantity: number,
    unitPrice: number,
    currency: string,
  ) {
    const db = this.ctx.getUserClient();
    const existing = await db.position.findUnique({
      where: { accountId_assetId: { accountId, assetId } },
    });
    const delta = type === 'SELL' ? -quantity : quantity;

    if (!existing) {
      if (delta > 0) {
        await db.position.create({
          data: { accountId, assetId, quantity: delta, averageCost: unitPrice, costCurrency: currency },
        });
      }

      return;
    }
    const newQty = existing.quantity + delta;

    await db.position.update({
      where: { id: existing.id },
      data: { quantity: newQty },
    });
  }
}
