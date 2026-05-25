import type { AppContext } from '../../../shared/app-context.js';
import { ok } from '../../../shared/kernel/result.js';
import { PatrimonyService } from '../../patrimony-history/application/patrimony-service.js';

/** Read-only analytics facade for charts */
export class AnalyticsService {
  private readonly patrimony: PatrimonyService;

  constructor(ctx: AppContext) {
    this.patrimony = new PatrimonyService(ctx);
  }

  async portfolioEvolution(portfolioId: string) {
    const history = await this.patrimony.listHistory(portfolioId);
    if (!history.ok) return history;
    const series = history.value.map((s) => ({
      date: s.capturedAt.toISOString(),
      value: s.totalValue,
      currency: s.currency,
    }));
    return ok({ portfolioId, series });
  }
}
