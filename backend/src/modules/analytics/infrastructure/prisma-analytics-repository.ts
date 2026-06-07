import type { PrismaClient as UserPrismaClient } from '../../../../node_modules/.prisma/user-client/index.js';
import type { AnalyticsRepository } from '../application/analytics-repository.js';
import type { AllocationSnapshot, AssetAllocation } from '../domain/analytics.js';

function toDomain(prisma: {
  id: string;
  portfolioId: string;
  snapshotDate: Date;
  totalValue: number;
  data: string;
  createdAt: Date;
}): AllocationSnapshot {
  return {
    id: prisma.id,
    portfolioId: prisma.portfolioId,
    snapshotDate: prisma.snapshotDate,
    totalValue: prisma.totalValue,
    data: JSON.parse(prisma.data) as AssetAllocation[],
    createdAt: prisma.createdAt,
  };
}

export class PrismaAnalyticsRepository implements AnalyticsRepository {
  public constructor(private readonly db: UserPrismaClient) {}

  public async saveSnapshot(data: {
    portfolioId: string;
    snapshotDate: Date;
    totalValue: number;
    data: AssetAllocation[];
  }): Promise<AllocationSnapshot> {
    const snapshot = await this.db.allocationSnapshot.upsert({
      create: {
        portfolioId: data.portfolioId,
        snapshotDate: data.snapshotDate,
        totalValue: data.totalValue,
        data: JSON.stringify(data.data),
      },
      update: {
        totalValue: data.totalValue,
        data: JSON.stringify(data.data),
      },
      where: {
        portfolioId_snapshotDate: {
          portfolioId: data.portfolioId,
          snapshotDate: data.snapshotDate,
        },
      },
    });

    return toDomain(snapshot);
  }

  public async findSnapshotsByPortfolio(portfolioId: string): Promise<AllocationSnapshot[]> {
    const snapshots = await this.db.allocationSnapshot.findMany({
      orderBy: { snapshotDate: 'asc' },
      where: { portfolioId },
    });

    return snapshots.map(toDomain);
  }

  public async findLatestSnapshot(portfolioId: string): Promise<AllocationSnapshot | null> {
    const snapshot = await this.db.allocationSnapshot.findFirst({
      orderBy: { snapshotDate: 'desc' },
      where: { portfolioId },
    });

    return snapshot ? toDomain(snapshot) : null;
  }

  public async deleteSnapshot(id: string): Promise<void> {
    await this.db.allocationSnapshot.delete({ where: { id } });
  }
}
