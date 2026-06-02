import type { AppContext } from '../../../shared/app-context.js';
import { ok } from '../../../shared/kernel/result.js';
import { ValuationService } from '../../valuation/application/valuation-service.js';

export class PatrimonyService {
  private readonly valuation: ValuationService;

  constructor(private readonly ctx: AppContext) {
    this.valuation = new ValuationService(ctx);
  }

  async captureSnapshot(portfolioId: string) {
    const db = this.ctx.getUserClient();
    const portfolio = await db.portfolio.findUniqueOrThrow({ where: { id: portfolioId } });
    const val = await this.valuation.getPortfolioValue(portfolioId, portfolio.baseCurrency);
    if (!val.ok) throw new Error('Valuation failed');
    const snap = await db.patrimonySnapshot.create({
      data: {
        portfolioId,
        totalValue: val.value.total,
        currency: val.value.currency,
        breakdown: JSON.stringify(val.value.breakdown),
      },
    });
    return ok(snap);
  }

  async listHistory(portfolioId: string) {
    const db = this.ctx.getUserClient();
    const items = await db.patrimonySnapshot.findMany({
      where: { portfolioId },
      orderBy: { capturedAt: 'asc' },
    });
    return ok(items);
  }
}
