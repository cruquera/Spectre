import type { AppContext } from '../../../shared/app-context.js';
import { type Result, ok } from '../../../shared/kernel/result.js';

export class InstitutionsService {
  constructor(private readonly ctx: AppContext) {}

  async list() {
    const db = this.ctx.getUserClient();
    const items = await db.institution.findMany({ orderBy: { name: 'asc' } });

    return ok(items);
  }

  async create(name: string, type: 'BANK' | 'BROKER'): Promise<Result<unknown, never>> {
    const db = this.ctx.getUserClient();
    const item = await db.institution.create({ data: { name, type } });

    return ok(item);
  }

  async delete(id: string) {
    const db = this.ctx.getUserClient();

    await db.institution.delete({ where: { id } });

    return ok(undefined);
  }
}
