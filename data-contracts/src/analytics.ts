import { z } from 'zod';

export const allocationTimeSeriesSchema = z.object({
  portfolioId: z.string(),
  portfolioName: z.string(),
  series: z.array(z.object({
    date: z.string(),
    data: z.array(z.object({
      assetClass: z.string(),
      label: z.string(),
      percentage: z.number(),
      value: z.number(),
    })),
  })),
});

export const monthlyContributionSummarySchema = z.object({
  year: z.number(),
  month: z.number(),
  totalContributions: z.number(),
  contributionsByAsset: z.array(z.object({
    assetClass: z.string(),
    label: z.string(),
    amount: z.number(),
    count: z.number(),
  })),
});

export const contributionImpactSchema = z.object({
  eventId: z.string(),
  eventDate: z.string(),
  eventType: z.string(),
  amount: z.number(),
  assetClass: z.string(),
  deviationBefore: z.number(),
  deviationAfter: z.number(),
  reduction: z.number(),
});

export const performanceSummarySchema = z.object({
  portfolioId: z.string(),
  portfolioName: z.string(),
  totalInvested: z.number(),
  currentValue: z.number(),
  growthAmount: z.number(),
  growthPercentage: z.number(),
  lastSnapshotDate: z.string().nullable(),
});

export const monthlyReportSchema = z.object({
  year: z.number(),
  month: z.number(),
  totalContributions: z.number(),
  performance: performanceSummarySchema,
  impacts: z.array(contributionImpactSchema),
});

export const snapshotResultSchema = z.object({
  id: z.string(),
  snapshotDate: z.string(),
});

export type AllocationTimeSeriesDto = z.infer<typeof allocationTimeSeriesSchema>;
export type MonthlyContributionSummaryDto = z.infer<typeof monthlyContributionSummarySchema>;
export type ContributionImpactDto = z.infer<typeof contributionImpactSchema>;
export type PerformanceSummaryDto = z.infer<typeof performanceSummarySchema>;
export type MonthlyReportDto = z.infer<typeof monthlyReportSchema>;
export type SnapshotResultDto = z.infer<typeof snapshotResultSchema>;
