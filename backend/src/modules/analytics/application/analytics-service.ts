import { type Result, ok } from '../../../shared/kernel/result.js';
import { PatrimonyService } from '../../patrimony-history/application/patrimony-service.js';

export class AnalyticsService {
  private readonly patrimony: PatrimonyService;

  public constructor(patrimony: PatrimonyService) {
    this.patrimony = patrimony;
  }

  public async portfolioEvolution(portfolioId: string): Promise<Result<{ portfolioId: string; series: Array<{ currency: string; date: string; value: number }> }, never>> {
    const history = await this.patrimony.listHistory(portfolioId);

    if (!history.ok) return history;
    const series = history.value.map((s: { capturedAt: Date; totalValue: number; currency: string }) => ({
      currency: s.currency,
      date: s.capturedAt.toISOString(),
      value: s.totalValue,
    }));

    return ok({ portfolioId, series });
  }
}
