import type { PrismaClient as UserPrismaClient } from '../../../../node_modules/.prisma/user-client/index.js';
import type { InvestmentBlocksRepository } from '../application/investment-blocks-repository.js';
import type { BlockAsset, InvestmentBlock, MonthlyBlockSchedule } from '../domain/investment-blocks.js';

export class PrismaInvestmentBlocksRepository implements InvestmentBlocksRepository {
  public constructor(private readonly db: UserPrismaClient) {}

  public list(): Promise<InvestmentBlock[]> {
    return this.db.investmentBlock.findMany({ orderBy: { name: 'asc' } });
  }

  public getById(id: string): Promise<InvestmentBlock | null> {
    return this.db.investmentBlock.findUnique({ where: { id } });
  }

  public create(name: string): Promise<InvestmentBlock> {
    return this.db.investmentBlock.create({ data: { name } });
  }

  public update(id: string, name: string): Promise<InvestmentBlock> {
    return this.db.investmentBlock.update({ data: { name }, where: { id } });
  }

  public async remove(id: string): Promise<void> {
    await this.db.investmentBlock.delete({ where: { id } });
  }

  public async addBlockAssets(data: Array<{ assetId: string; blockId: string }>): Promise<void> {
    await this.db.blockAsset.createMany({ data });
  }

  public async removeBlockAssets(blockId: string): Promise<void> {
    await this.db.blockAsset.deleteMany({ where: { blockId } });
  }

  public async upsertMonthlyBlock(year: number, month: number, blockId: string): Promise<void> {
    await this.db.monthlyBlockSchedule.upsert({
      create: { blockId, month, year },
      update: { blockId },
      where: { year_month: { month, year } },
    });
  }

  public async getMonthlyBlock(year: number, month: number): Promise<{
    block: InvestmentBlock & { assets: BlockAsset[] };
  } | null> {
    const result = await this.db.monthlyBlockSchedule.findUnique({
      include: { block: { include: { assets: true } } },
      where: { year_month: { month, year } },
    });

    return result;
  }

  public async getSchedule(year: number): Promise<MonthlyBlockSchedule[]> {
    return this.db.monthlyBlockSchedule.findMany({ where: { year } });
  }
}
