import type { TaxRepository } from './tax-repository.js';
import type { AppContext } from '../../../shared/app-context.js';
import { type Result, ok } from '../../../shared/kernel/result.js';
import type { TaxPreview, TaxReport } from '../domain/tax-report.js';

export class TaxService {
  public constructor(
    private readonly ctx: AppContext,
    private readonly repo: TaxRepository,
  ) {}

  public async generatePreview(year: number): Promise<Result<{ preview: TaxPreview; report: TaxReport }, never>> {
    const db = this.ctx.getUserClient();
    const sells = await db.transaction.findMany({
      include: { asset: true },
      where: { tradeDate: { gte: new Date(`${year}-01-01`), lte: new Date(`${year}-12-31`) }, type: 'SELL' },
    });
    const preview: TaxPreview = {
      message: 'Módulo IR completo em fase posterior. Preview baseado em vendas.',
      sellCount: sells.length,
      year,
    };
    const report = await this.repo.createReport({
      data: JSON.stringify(preview),
      reportType: 'PREVIEW',
      year,
    });

    return ok({ preview, report });
  }

  public async listReports(): Promise<Result<TaxReport[], never>> {
    const items = await this.repo.listReports();

    return ok(items);
  }
}
