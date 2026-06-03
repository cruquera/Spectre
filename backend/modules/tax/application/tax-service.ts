import type { AppContext } from '../../../shared/app-context.js';
import { ok } from '../../../shared/kernel/result.js';

/** Phase 9 ??? base structure for future IR Brasil module */
export class TaxService {
  constructor(private readonly ctx: AppContext) {}

  async generatePreview(year: number) {
    const db = this.ctx.getUserClient();
    const sells = await db.transaction.findMany({
      where: { type: 'SELL', tradeDate: { gte: new Date(`${year}-01-01`), lte: new Date(`${year}-12-31`) } },
      include: { asset: true },
    });
    const preview = {
  message: 'M??dulo IR completo em fase posterior. Preview baseado em vendas.',
  sellCount: sells.length,
  year
};
    const report = await db.taxReport.create({
      data: {
  data: JSON.stringify(preview),
  reportType: 'PREVIEW',
  year
},
    });

    return ok({ report, preview });
  }

  async listReports() {
    const db = this.ctx.getUserClient();
    const items = await db.taxReport.findMany({ orderBy: { year: 'desc' } });

    return ok(items);
  }
}
