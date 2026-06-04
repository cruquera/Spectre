import type { AssetTargetAllocation, CategoryAllocation } from '../domain/allocation.js';

export type AllocationRepository = {
  getPortfolio(portfolioId: string): Promise<{ id: string; baseCurrency: string }>;
  setCategoryTarget(portfolioId: string, category: string, targetPercent: number): Promise<void>;
  setAssetTarget(portfolioId: string, assetId: string, targetPercent: number): Promise<void>;
  getCategoryTargets(portfolioId: string): Promise<CategoryAllocation[]>;
  getAssetTargets(portfolioId: string): Promise<AssetTargetAllocation[]>;
  saveAnalysis(data: {
    portfolioId: string;
    thresholdPercent: number;
    results: string;
  }): Promise<void>;
}
