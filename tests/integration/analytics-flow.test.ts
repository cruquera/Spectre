import { jest } from '@jest/globals';

import type { AnalyticsRepository } from '../../backend/src/modules/analytics/application/analytics-repository.js';
import { AnalyticsService } from '../../backend/src/modules/analytics/application/analytics-service.js';
import type { InvestmentPortfolioRepository } from '../../backend/src/modules/investment-portfolio/application/investment-portfolio-repository.js';
import type { LedgerEventRepository } from '../../backend/src/modules/ledger-event/application/ledger-event-repository.js';
import type { AppContext } from '../../backend/src/shared/app-context.js';
import {
  allocationTimeSeriesSchema,
  monthlyContributionSummarySchema,
  monthlyReportSchema,
  performanceSummarySchema,
  snapshotResultSchema,
} from '../../data-contracts/src/analytics.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mockResolved<T>(value: T) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return jest.fn<(...args: any[]) => Promise<T>>().mockResolvedValue(value);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mockImpl<T extends (...args: any[]) => any>(fn: T) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return jest.fn<(...args: any[]) => ReturnType<T>>().mockImplementation(fn);
}

function createMockCtx(): AppContext {
  return { requireSession: jest.fn().mockReturnValue({ username: 'test', displayName: 'Test' }) } as unknown as AppContext;
}

function makeMockRepos() {
  let snapshots: Array<Record<string, unknown>> = [];

  const analyticsRepo = {
    // eslint-disable-next-line @typescript-eslint/require-await
    saveSnapshot: mockImpl(async (d: Record<string, unknown>) => {
      const snap = { id: `snap_${snapshots.length + 1}`, ...d, createdAt: new Date() };

      snapshots.push(snap);

      return snap;
    }),
    // eslint-disable-next-line @typescript-eslint/require-await
    findSnapshotsByPortfolio: mockImpl(async (_pid: string) =>
      snapshots.filter((s) => s.portfolioId === _pid),
    ),
    // eslint-disable-next-line @typescript-eslint/require-await
    findLatestSnapshot: mockImpl(async (_pid: string) => {
      const sorted = snapshots
        .filter((s) => s.portfolioId === _pid)
        .sort((a, b) => (b.snapshotDate as Date).getTime() - (a.snapshotDate as Date).getTime());

      return sorted[0] ?? null;
    }),
    deleteSnapshot: mockResolved(undefined),
  } as unknown as AnalyticsRepository;

  const portfolioRepo = {
    findAll: mockResolved([]),
    findById: jest.fn() as unknown as InvestmentPortfolioRepository['findById'],
    create: jest.fn() as unknown as InvestmentPortfolioRepository['create'],
    updateAssetValues: jest.fn() as unknown as InvestmentPortfolioRepository['updateAssetValues'],
    delete: jest.fn() as unknown as InvestmentPortfolioRepository['delete'],
  };

  const ledgerRepo = {
    create: jest.fn() as unknown as LedgerEventRepository['create'],
    findByPortfolioId: jest.fn() as unknown as LedgerEventRepository['findByPortfolioId'],
    findRecent: jest.fn() as unknown as LedgerEventRepository['findRecent'],
    delete: jest.fn() as unknown as LedgerEventRepository['delete'],
  };

  return { analyticsRepo, portfolioRepo, ledgerRepo, resetSnapshots: () => { snapshots = []; } };
}

const ACTIVE = 'ACTIVE' as const;

describe('Analytics Flow', () => {
  describe('Snapshot → AllocationHistory (full flow)', () => {
    it('records a snapshot and retrieves it via allocation history', async () => {
      const { analyticsRepo, portfolioRepo, ledgerRepo, resetSnapshots } = makeMockRepos();

      resetSnapshots();

      portfolioRepo.findById = mockResolved({
        id: 'p1', name: 'Carteira Teste', status: ACTIVE,
        createdAt: new Date('2025-01-01'), updatedAt: new Date('2025-06-01'),
        userProfileId: 'u1', templateId: 't1',
        assetValues: [
          { id: 'av1', assetClass: 'crypto', optionalTickerDescription: null, targetPercentage: 30, currentValue: 3000, classTargetId: null },
          { id: 'av2', assetClass: 'fixed_income_post', optionalTickerDescription: 'Tesouro Selic', targetPercentage: 70, currentValue: 7000, classTargetId: null },
        ],
      });

      const service = new AnalyticsService(createMockCtx(), analyticsRepo, portfolioRepo, ledgerRepo);

      const snapResult = await service.recordSnapshot('p1');

      expect(snapResult.ok).toBe(true);
      if (snapResult.ok) {
        expect(snapshotResultSchema.safeParse(snapResult.value).success).toBe(true);
      }

      const historyResult = await service.getAllocationHistory('p1');

      expect(historyResult.ok).toBe(true);
      if (historyResult.ok) {
        expect(allocationTimeSeriesSchema.safeParse(historyResult.value).success).toBe(true);
        expect(historyResult.value.series).toHaveLength(1);
        expect(historyResult.value.series[0].data).toHaveLength(2);
      }
    });

    it('aggregates contributions and returns valid DTOs', async () => {
      const { analyticsRepo, portfolioRepo, ledgerRepo, resetSnapshots } = makeMockRepos();

      resetSnapshots();
      portfolioRepo.findById = mockResolved({
        id: 'p2', name: 'Carteira', status: ACTIVE,
        createdAt: new Date(), updatedAt: new Date(),
        userProfileId: 'u1', templateId: 't1',
        assetValues: [
          { id: 'av1', assetClass: 'crypto', optionalTickerDescription: null, targetPercentage: 50, currentValue: 5000, classTargetId: null },
          { id: 'av2', assetClass: 'fixed_income_post', optionalTickerDescription: null, targetPercentage: 50, currentValue: 5000, classTargetId: null },
        ],
      });

      ledgerRepo.findByPortfolioId = mockResolved([
        { id: 'e1', eventType: 'INVESTMENT_CONTRIBUTION', grossAmount: 1000, feesAmount: 0, taxAmount: 0, netAmount: 1000, currency: 'BRL', occurredAt: new Date('2025-04-05T12:00:00'), notes: null, createdAt: new Date(), portfolioId: 'p2', accountId: 'a1', assetValueId: 'av1', assetClassName: 'crypto' },
        { id: 'e2', eventType: 'INVESTMENT_CONTRIBUTION', grossAmount: 2000, feesAmount: 0, taxAmount: 0, netAmount: 2000, currency: 'BRL', occurredAt: new Date('2025-04-20T12:00:00'), notes: null, createdAt: new Date(), portfolioId: 'p2', accountId: 'a1', assetValueId: 'av2', assetClassName: 'fixed_income_post' },
        { id: 'e3', eventType: 'INVESTMENT_CONTRIBUTION', grossAmount: 1500, feesAmount: 0, taxAmount: 0, netAmount: 1500, currency: 'BRL', occurredAt: new Date('2025-05-01T12:00:00'), notes: null, createdAt: new Date(), portfolioId: 'p2', accountId: 'a1', assetValueId: 'av1', assetClassName: 'crypto' },
      ]);

      const service = new AnalyticsService(createMockCtx(), analyticsRepo, portfolioRepo, ledgerRepo);

      const contribResult = await service.getContributionHistory('p2');

      expect(contribResult.ok).toBe(true);
      if (contribResult.ok) {
        expect(contribResult.value).toHaveLength(2);
        for (const item of contribResult.value) {
          expect(monthlyContributionSummarySchema.safeParse(item).success).toBe(true);
        }
        expect(contribResult.value[0].totalContributions).toBe(3000);
        expect(contribResult.value[1].totalContributions).toBe(1500);
      }
    });

    it('produces a valid monthly report with impacts', async () => {
      const { analyticsRepo, portfolioRepo, ledgerRepo, resetSnapshots } = makeMockRepos();

      resetSnapshots();
      portfolioRepo.findById = mockResolved({
        id: 'p3', name: 'Carteira', status: ACTIVE,
        createdAt: new Date(), updatedAt: new Date(),
        userProfileId: 'u1', templateId: 't1',
        assetValues: [
          { id: 'av1', assetClass: 'crypto', optionalTickerDescription: null, targetPercentage: 30, currentValue: 3000, classTargetId: null },
          { id: 'av2', assetClass: 'fixed_income_post', optionalTickerDescription: null, targetPercentage: 70, currentValue: 7000, classTargetId: null },
        ],
      });

      ledgerRepo.findByPortfolioId = mockResolved([
        { id: 'e1', eventType: 'INVESTMENT_CONTRIBUTION', grossAmount: 1000, feesAmount: 0, taxAmount: 0, netAmount: 1000, currency: 'BRL', occurredAt: new Date('2025-05-10T12:00:00'), notes: null, createdAt: new Date(), portfolioId: 'p3', accountId: 'a1', assetValueId: 'av1', assetClassName: 'crypto' },
        { id: 'e2', eventType: 'INVESTMENT_CONTRIBUTION', grossAmount: 500, feesAmount: 0, taxAmount: 0, netAmount: 500, currency: 'BRL', occurredAt: new Date('2025-05-15T12:00:00'), notes: null, createdAt: new Date(), portfolioId: 'p3', accountId: 'a1', assetValueId: 'av2', assetClassName: 'fixed_income_post' },
      ]);

      const service = new AnalyticsService(createMockCtx(), analyticsRepo, portfolioRepo, ledgerRepo);

      const reportResult = await service.getMonthlyReport('p3', 2025, 5);

      expect(reportResult.ok).toBe(true);
      if (reportResult.ok) {
        expect(monthlyReportSchema.safeParse(reportResult.value).success).toBe(true);
        expect(reportResult.value.totalContributions).toBe(1500);
        expect(reportResult.value.impacts).toHaveLength(2);
        expect(reportResult.value.performance.currentValue).toBe(10000);
      }
    });

    it('calculates performance summary with valid DTO shape', async () => {
      const { analyticsRepo, portfolioRepo, ledgerRepo, resetSnapshots } = makeMockRepos();

      resetSnapshots();
      portfolioRepo.findById = mockResolved({
        id: 'p4', name: 'Carteira Performance', status: ACTIVE,
        createdAt: new Date(), updatedAt: new Date(),
        userProfileId: 'u1', templateId: 't1',
        assetValues: [
          { id: 'av1', assetClass: 'crypto', optionalTickerDescription: null, targetPercentage: 50, currentValue: 12000, classTargetId: null },
        ],
      });

      ledgerRepo.findByPortfolioId = mockResolved([
        { id: 'e1', eventType: 'INVESTMENT_CONTRIBUTION', grossAmount: 5000, feesAmount: 0, taxAmount: 0, netAmount: 5000, currency: 'BRL', occurredAt: new Date('2025-01-01'), notes: null, createdAt: new Date(), portfolioId: 'p4', accountId: 'a1', assetValueId: 'av1', assetClassName: 'crypto' },
        { id: 'e2', eventType: 'INVESTMENT_CONTRIBUTION', grossAmount: 3000, feesAmount: 0, taxAmount: 0, netAmount: 3000, currency: 'BRL', occurredAt: new Date('2025-02-01'), notes: null, createdAt: new Date(), portfolioId: 'p4', accountId: 'a1', assetValueId: 'av1', assetClassName: 'crypto' },
      ]);

      const service = new AnalyticsService(createMockCtx(), analyticsRepo, portfolioRepo, ledgerRepo);

      const perfResult = await service.getPerformanceSummary('p4');

      expect(perfResult.ok).toBe(true);
      if (perfResult.ok) {
        expect(performanceSummarySchema.safeParse(perfResult.value).success).toBe(true);
        expect(perfResult.value.totalInvested).toBe(8000);
        expect(perfResult.value.currentValue).toBe(12000);
        expect(perfResult.value.growthAmount).toBe(4000);
        expect(perfResult.value.growthPercentage).toBe(50);
      }
    });
  });
});
