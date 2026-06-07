import type { AllocationSnapshot, AssetAllocation } from '../domain/analytics.js';

export type AnalyticsRepository = {
  saveSnapshot(data: {
    portfolioId: string;
    snapshotDate: Date;
    totalValue: number;
    data: AssetAllocation[];
  }): Promise<AllocationSnapshot>;
  findSnapshotsByPortfolio(portfolioId: string): Promise<AllocationSnapshot[]>;
  findLatestSnapshot(portfolioId: string): Promise<AllocationSnapshot | null>;
  deleteSnapshot(id: string): Promise<void>;
};
