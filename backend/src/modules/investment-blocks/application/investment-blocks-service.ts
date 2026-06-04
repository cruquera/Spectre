import type { InvestmentBlocksRepository } from './investment-blocks-repository.js';
import type { AppContext } from '../../../shared/app-context.js';
import { type Result, ok } from '../../../shared/kernel/result.js';
import type { InvestmentBlock } from '../domain/investment-blocks.js';

export class InvestmentBlocksService {
  public constructor(
    private readonly ctx: AppContext,
    private readonly repo: InvestmentBlocksRepository,
  ) {}

  public async list(): Promise<Result<InvestmentBlock[], never>> {
    const items = await this.repo.list();

    return ok(items);
  }

  public async getById(id: string): Promise<Result<InvestmentBlock | null, never>> {
    const entity = await this.repo.getById(id);

    return ok(entity);
  }

  public async create(input: { name: string }): Promise<Result<InvestmentBlock, never>> {
    const entity = await this.repo.create(input.name);

    return ok(entity);
  }

  public async update(input: { id: string; name: string }): Promise<Result<InvestmentBlock, never>> {
    const entity = await this.repo.update(input.id, input.name);

    return ok(entity);
  }

  public async remove(id: string): Promise<Result<void, never>> {
    await this.repo.remove(id);

    return ok(undefined);
  }

  public async createBlock(name: string, assetIds: string[]): Promise<Result<InvestmentBlock, never>> {
    const block = await this.repo.create(name);

    await this.repo.addBlockAssets(
      assetIds.map((assetId) => ({ assetId, blockId: block.id })),
    );

    return ok(block);
  }

  public async setMonthlyBlock(year: number, month: number, blockId: string): Promise<Result<void, never>> {
    await this.repo.upsertMonthlyBlock(year, month, blockId);

    return ok(undefined);
  }

  public async getSchedule(year: number): Promise<Result<Array<import('../domain/investment-blocks.js').MonthlyBlockSchedule>, never>> {
    const items = await this.repo.getSchedule(year);

    return ok(items);
  }
}
