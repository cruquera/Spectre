export type AssetAllocation = {
  assetValueId: string;
  assetClass: string;
  optionalTickerDescription: string | null;
  targetPercentage: number;
  currentValue: number;
  realPercentage: number;
  deviation: number;
};

export type AllocationSnapshot = {
  id: string;
  portfolioId: string;
  snapshotDate: Date;
  totalValue: number;
  data: AssetAllocation[];
  createdAt: Date;
};

export type AllocationTimeSeries = {
  portfolioId: string;
  portfolioName: string;
  series: Array<{
    date: string;
    data: Array<{
      assetClass: string;
      label: string;
      percentage: number;
      value: number;
    }>;
  }>;
};

export type MonthlyContributionSummary = {
  year: number;
  month: number;
  totalContributions: number;
  contributionsByAsset: Array<{
    assetClass: string;
    label: string;
    amount: number;
    count: number;
  }>;
};

export type ContributionImpact = {
  eventId: string;
  eventDate: string;
  eventType: string;
  amount: number;
  assetClass: string;
  deviationBefore: number;
  deviationAfter: number;
  reduction: number;
};

export type PerformanceSummary = {
  portfolioId: string;
  portfolioName: string;
  totalInvested: number;
  currentValue: number;
  growthAmount: number;
  growthPercentage: number;
  lastSnapshotDate: string | null;
};

export type MonthlyReport = {
  year: number;
  month: number;
  totalContributions: number;
  performance: PerformanceSummary;
  impacts: ContributionImpact[];
};
