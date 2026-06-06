import type { PrismaClient as UserPrismaClient } from '../../../../node_modules/.prisma/user-client/index.js';
import type { PatrimonyRepository } from '../application/patrimony-repository.js';
import type { PatrimonySnapshot } from '../domain/patrimony-snapshot.js';

export class PrismaPatrimonyRepository implements PatrimonyRepository {
  public constructor(private readonly db: UserPrismaClient) {}

  public async findPortfolioBaseCurrency(portfolioId: string): Promise<string> {
    const portfolio = await this.db.portfolio.findUniqueOrThrow({
      select: { baseCurrency: true },
      where: { id: portfolioId },
    });

    return portfolio.baseCurrency;
  }

  public async createSnapshot(data: {
    breakdown: string;
    currency: string;
    portfolioId: string;
    totalValue: number;
  }): Promise<PatrimonySnapshot> {
    return this.db.patrimonySnapshot.create({ data });
  }

  public async listSnapshots(portfolioId: string): Promise<PatrimonySnapshot[]> {
    return this.db.patrimonySnapshot.findMany({
      orderBy: { capturedAt: 'asc' },
      where: { portfolioId },
    });
  }
}
