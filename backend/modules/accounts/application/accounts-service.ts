import type { AppContext } from '../../../shared/app-context.js';
import { ok } from '../../../shared/kernel/result.js';

export class AccountsService {
  constructor(private readonly ctx: AppContext) {}

  async list(institutionId?: string) {
    const db = this.ctx.getUserClient();
    const items = await db.account.findMany({
      where: institutionId ? { institutionId } : undefined,
      orderBy: { name: 'asc' },
    });

    return ok(items);
  }

  async create(institutionId: string, name: string, currency: string) {
    const db = this.ctx.getUserClient();
    const item = await db.account.create({
      data: { institutionId, name, currency },
    });

    return ok(item);
  }
}
