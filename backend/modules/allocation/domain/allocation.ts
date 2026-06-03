export type CategoryAllocation = {
  id: string;
  portfolioId: string;
  category: string;
  targetPercent: number;
};

export type AssetTargetAllocation = {
  id: string;
  portfolioId: string;
  assetId: string;
  targetPercent: number;
  asset?: { symbol: string; category: string } | null;
};
