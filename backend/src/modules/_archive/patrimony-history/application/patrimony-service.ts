import type { PatrimonyRepository } from './patrimony-repository.js';
import type { AppContext } from '../../../shared/app-context.js';
import { type Result, ok } from '../../../shared/kernel/result.js';
import { ValuationService } from '../../valuation/application/valuation-service.js';
import type { PatrimonySnapshot } from '../domain/patrimony-snapshot.js';

export class PatrimonyService {
  private readonly valuation: ValuationService;

  public constructor(
    private readonly ctx: AppContext,
    private readonly repo: PatrimonyRepository,
    valuation: ValuationService,
  ) {
    this.valuation = valuation;
  }

  public async captureSnapshot(portfolioId: string): Promise<Result<PatrimonySnapshot, never>> {
    const baseCurrency = await this.repo.findPortfolioBaseCurrency(portfolioId);
    const val = await this.valuation.getPortfolioValue(portfolioId, baseCurrency);

    if (!val.ok) throw new Error('Valuation failed');
    const snap = await this.repo.createSnapshot({
      breakdown: JSON.stringify(val.value.breakdown),
      currency: val.value.currency,
      portfolioId,
      totalValue: val.value.total,
    });

    return ok(snap);
  }

  public async listHistory(portfolioId: string): Promise<Result<PatrimonySnapshot[], never>> {
    const items = await this.repo.listSnapshots(portfolioId);

    return ok(items);
  }
}
