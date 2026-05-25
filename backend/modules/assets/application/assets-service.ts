import type { AppContext } from '../../../shared/app-context.js';
import { ok } from '../../../shared/kernel/result.js';

type AssetCategory = 'CRYPTO' | 'FIXED_INCOME' | 'VARIABLE_INCOME' | 'REAL_ESTATE';

export class AssetsService {
  constructor(private readonly ctx: AppContext) {}

  async list(category?: AssetCategory) {
    const db = this.ctx.getUserClient();
    const items = await db.asset.findMany({
      where: category ? { category } : undefined,
      orderBy: { symbol: 'asc' },
    });
    return ok(items);
  }

  async create(data: {
    symbol: string;
    name: string;
    assetType: string;
    category: AssetCategory;
    currency: string;
  }) {
    const db = this.ctx.getUserClient();
    const item = await db.asset.create({ data });
    return ok(item);
  }
}
