import { jest } from '@jest/globals';

import type { AnalyticsRepository } from '../../backend/src/modules/analytics/application/analytics-repository.js';
import { AnalyticsService } from '../../backend/src/modules/analytics/application/analytics-service.js';
import type { AllocationSnapshot } from '../../backend/src/modules/analytics/domain/analytics.js';
import type { InvestmentPortfolioRepository } from '../../backend/src/modules/investment-portfolio/application/investment-portfolio-repository.js';
import type { LedgerEventRepository } from '../../backend/src/modules/ledger-event/application/ledger-event-repository.js';
import type { AppContext } from '../../backend/src/shared/app-context.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mockResolved<T>(value: T) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return jest.fn<(...args: any[]) => Promise<T>>().mockResolvedValue(value);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mockRejected(value: Error) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return jest.fn<(...args: any[]) => Promise<never>>().mockRejectedValue(value);
}

function createMockCtx(): AppContext {
  return {
    requireSession: jest.fn().mockReturnValue({ username: 'test', displayName: 'Test' }),
    getSession: jest.fn(),
    setSession: jest.fn(),
    getUserClient: jest.fn(),
    setUserClient: jest.fn(),
    getBenchmarkClient: jest.fn(),
    setBenchmarkClient: jest.fn(),
    getDataRoot: jest.fn(),
  } as unknown as AppContext;
}

function createMockPortfolioRepo(overrides: Record<string, unknown> = {}) {
  const base: Record<string, unknown> = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    updateAssetValues: jest.fn(),
    delete: jest.fn(),
  };

  return { ...base, ...overrides } as unknown as InvestmentPortfolioRepository;
}

function createMockLedgerRepo(overrides: Record<string, unknown> = {}) {
  const base: Record<string, unknown> = {
    create: jest.fn(),
    findByPortfolioId: jest.fn(),
    findRecent: jest.fn(),
    delete: jest.fn(),
  };

  return { ...base, ...overrides } as unknown as LedgerEventRepository;
}

function createMockAnalyticsRepo(overrides: Record<string, unknown> = {}) {
  const base: Record<string, unknown> = {
    saveSnapshot: jest.fn(),
    findSnapshotsByPortfolio: jest.fn(),
    findLatestSnapshot: jest.fn(),
    deleteSnapshot: jest.fn(),
  };

  return { ...base, ...overrides } as unknown as AnalyticsRepository;
}

function makePortfolio(overrides: Record<string, unknown> = {}) {
  return {
    id: 'p1',
    name: 'Minha Carteira',
    status: 'ACTIVE',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-06-01T12:00:00'),
    userProfileId: 'u1',
    templateId: 't1',
    assetValues: [
      { id: 'av1', assetClass: 'crypto', optionalTickerDescription: null, targetPercentage: 30, currentValue: 2000, classTargetId: null },
      { id: 'av2', assetClass: 'fixed_income_post', optionalTickerDescription: 'Tesouro Selic', targetPercentage: 70, currentValue: 8000, classTargetId: null },
    ],
    ...overrides,
  };
}

function makeSnapshot(overrides: Partial<AllocationSnapshot> = {}): AllocationSnapshot {
  return {
    id: 'snap1',
    portfolioId: 'p1',
    snapshotDate: new Date('2025-05-01T12:00:00'),
    totalValue: 10000,
    data: [
      { assetValueId: 'av1', assetClass: 'crypto', optionalTickerDescription: null, targetPercentage: 30, currentValue: 2000, realPercentage: 20, deviation: -10 },
      { assetValueId: 'av2', assetClass: 'fixed_income_post', optionalTickerDescription: 'Tesouro Selic', targetPercentage: 70, currentValue: 8000, realPercentage: 80, deviation: 10 },
    ],
    createdAt: new Date('2025-05-01T12:00:00Z'),
    ...overrides,
  };
}

function makeContributionEvent(overrides: Record<string, unknown> = {}) {
  return {
    id: 'e1',
    eventType: 'INVESTMENT_CONTRIBUTION',
    grossAmount: 1000,
    feesAmount: 0,
    taxAmount: 0,
    netAmount: 1000,
    currency: 'BRL',
    occurredAt: new Date('2025-05-10T12:00:00'),
    notes: null,
    createdAt: new Date('2025-05-10T12:00:00'),
    portfolioId: 'p1',
    accountId: 'a1',
    assetValueId: 'av1',
    assetClassName: 'crypto',
    ...overrides,
  };
}

describe('AnalyticsService', () => {
  describe('recordSnapshot', () => {
    it('returns portfolio not found error when portfolio does not exist', async () => {
      const portfolioRepo = createMockPortfolioRepo({ findById: mockResolved(null) });
      const service = new AnalyticsService(createMockCtx(), createMockAnalyticsRepo(), portfolioRepo, createMockLedgerRepo());
      const result = await service.recordSnapshot('nonexistent');

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe('PORTFOLIO_NOT_FOUND');
      }
    });

    it('saves snapshot and returns id and date on success', async () => {
      const portfolio = makePortfolio();
      const snapshotDate = new Date('2025-06-06T10:00:00Z');
      const analyticsRepo = createMockAnalyticsRepo({
        saveSnapshot: mockResolved({ id: 'snap_new', portfolioId: 'p1', snapshotDate, totalValue: 10000, data: [], createdAt: snapshotDate }),
      });
      const portfolioRepo = createMockPortfolioRepo({ findById: mockResolved(portfolio) });
      const service = new AnalyticsService(createMockCtx(), analyticsRepo, portfolioRepo, createMockLedgerRepo());
      const result = await service.recordSnapshot('p1');

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.id).toBe('snap_new');
        expect(result.value.snapshotDate).toBe(snapshotDate.toISOString());
      }
    });

    it('handles zero total value gracefully', async () => {
      const portfolio = makePortfolio({ assetValues: [
        { id: 'av1', assetClass: 'crypto', optionalTickerDescription: null, targetPercentage: 100, currentValue: 0, classTargetId: null },
      ] });
      const analyticsRepo = createMockAnalyticsRepo({
        saveSnapshot: mockResolved({ id: 'snap_z', portfolioId: 'p1', snapshotDate: new Date(), totalValue: 0, data: [], createdAt: new Date() }),
      });
      const portfolioRepo = createMockPortfolioRepo({ findById: mockResolved(portfolio) });
      const service = new AnalyticsService(createMockCtx(), analyticsRepo, portfolioRepo, createMockLedgerRepo());
      const result = await service.recordSnapshot('p1');

      expect(result.ok).toBe(true);
    });

    it('returns error when repo throws', async () => {
      const portfolio = makePortfolio();
      const analyticsRepo = createMockAnalyticsRepo({
        saveSnapshot: mockRejected(new Error('DB error')),
      });
      const portfolioRepo = createMockPortfolioRepo({ findById: mockResolved(portfolio) });
      const service = new AnalyticsService(createMockCtx(), analyticsRepo, portfolioRepo, createMockLedgerRepo());
      const result = await service.recordSnapshot('p1');

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe('RECORD_SNAPSHOT_FAILED');
      }
    });
  });

  describe('getAllocationHistory', () => {
    it('returns portfolio not found error when portfolio does not exist', async () => {
      const portfolioRepo = createMockPortfolioRepo({ findById: mockResolved(null) });
      const service = new AnalyticsService(createMockCtx(), createMockAnalyticsRepo(), portfolioRepo, createMockLedgerRepo());
      const result = await service.getAllocationHistory('nonexistent');

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe('PORTFOLIO_NOT_FOUND');
      }
    });

    it('returns series from saved snapshots', async () => {
      const portfolio = makePortfolio();
      const snapshot = makeSnapshot({ snapshotDate: new Date('2025-05-01T12:00:00') });
      const analyticsRepo = createMockAnalyticsRepo({ findSnapshotsByPortfolio: mockResolved([snapshot]) });
      const portfolioRepo = createMockPortfolioRepo({ findById: mockResolved(portfolio) });
      const service = new AnalyticsService(createMockCtx(), analyticsRepo, portfolioRepo, createMockLedgerRepo());
      const result = await service.getAllocationHistory('p1');

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.portfolioId).toBe('p1');
        expect(result.value.portfolioName).toBe('Minha Carteira');
        expect(result.value.series).toHaveLength(1);
        expect(result.value.series[0].date).toBe('2025-05-01');
        expect(result.value.series[0].data).toHaveLength(2);
      }
    });

    it('returns current allocation when no snapshots exist', async () => {
      const portfolio = makePortfolio();
      const analyticsRepo = createMockAnalyticsRepo({ findSnapshotsByPortfolio: mockResolved([]) });
      const portfolioRepo = createMockPortfolioRepo({ findById: mockResolved(portfolio) });
      const service = new AnalyticsService(createMockCtx(), analyticsRepo, portfolioRepo, createMockLedgerRepo());
      const result = await service.getAllocationHistory('p1');

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.series).toHaveLength(1);
        const today = new Date().toISOString().split('T')[0];

        expect(result.value.series[0].date).toBe(today);
        expect(result.value.series[0].data).toHaveLength(2);
      }
    });

    it('maps asset class labels correctly', async () => {
      const portfolio = makePortfolio();
      const analyticsRepo = createMockAnalyticsRepo({ findSnapshotsByPortfolio: mockResolved([]) });
      const portfolioRepo = createMockPortfolioRepo({ findById: mockResolved(portfolio) });
      const service = new AnalyticsService(createMockCtx(), analyticsRepo, portfolioRepo, createMockLedgerRepo());
      const result = await service.getAllocationHistory('p1');

      expect(result.ok).toBe(true);
      if (result.ok) {
        const labels = result.value.series[0].data.map((d) => d.label);

        expect(labels).toContain('Criptomoedas');
        expect(labels).toContain('Renda Fixa Pós-Fixada');
      }
    });
  });

  describe('getContributionHistory', () => {
    it('returns empty array when no contributions exist', async () => {
      const ledgerRepo = createMockLedgerRepo({ findByPortfolioId: mockResolved([]) });
      const service = new AnalyticsService(createMockCtx(), createMockAnalyticsRepo(), createMockPortfolioRepo(), ledgerRepo);
      const result = await service.getContributionHistory('p1');

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toEqual([]);
      }
    });

    it('aggregates contributions by month', async () => {
      const ledgerRepo = createMockLedgerRepo({
        findByPortfolioId: mockResolved([
          makeContributionEvent({ id: 'e1', netAmount: 500, occurredAt: new Date('2025-05-01T12:00:00'), assetClassName: 'crypto' }),
          makeContributionEvent({ id: 'e2', netAmount: 300, occurredAt: new Date('2025-05-15T12:00:00'), assetClassName: 'crypto' }),
          makeContributionEvent({ id: 'e3', netAmount: 1000, occurredAt: new Date('2025-06-01T12:00:00'), assetClassName: 'fixed_income_post' }),
        ]),
      });
      const service = new AnalyticsService(createMockCtx(), createMockAnalyticsRepo(), createMockPortfolioRepo(), ledgerRepo);
      const result = await service.getContributionHistory('p1');

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toHaveLength(2);
        const may = result.value.find((r) => r.month === 5)!;

        expect(may.totalContributions).toBe(800);
        expect(may.contributionsByAsset).toHaveLength(1);
        expect(may.contributionsByAsset[0].count).toBe(2);
        const jun = result.value.find((r) => r.month === 6)!;

        expect(jun.totalContributions).toBe(1000);
      }
    });

    it('sorts months chronologically', async () => {
      const ledgerRepo = createMockLedgerRepo({
        findByPortfolioId: mockResolved([
          makeContributionEvent({ id: 'e3', netAmount: 100, occurredAt: new Date('2025-06-01T12:00:00') }),
          makeContributionEvent({ id: 'e1', netAmount: 200, occurredAt: new Date('2025-04-01T12:00:00') }),
          makeContributionEvent({ id: 'e2', netAmount: 300, occurredAt: new Date('2025-05-01T12:00:00') }),
        ]),
      });
      const service = new AnalyticsService(createMockCtx(), createMockAnalyticsRepo(), createMockPortfolioRepo(), ledgerRepo);
      const result = await service.getContributionHistory('p1');

      expect(result.ok).toBe(true);
      if (result.ok) {
        const sorted = [...result.value].sort((a, b) => a.year - b.year || a.month - b.month);

        expect(sorted[0].month).toBe(4);
        expect(sorted[1].month).toBe(5);
        expect(sorted[2].month).toBe(6);
      }
    });
  });

  describe('getPerformanceSummary', () => {
    it('returns portfolio not found when portfolio does not exist', async () => {
      const portfolioRepo = createMockPortfolioRepo({ findById: mockResolved(null) });
      const service = new AnalyticsService(createMockCtx(), createMockAnalyticsRepo(), portfolioRepo, createMockLedgerRepo());
      const result = await service.getPerformanceSummary('nonexistent');

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe('PORTFOLIO_NOT_FOUND');
      }
    });

    it('calculates growth correctly', async () => {
      const portfolio = makePortfolio({ assetValues: [
        { id: 'av1', assetClass: 'crypto', optionalTickerDescription: null, targetPercentage: 50, currentValue: 6000, classTargetId: null },
        { id: 'av2', assetClass: 'fixed_income_post', optionalTickerDescription: null, targetPercentage: 50, currentValue: 4000, classTargetId: null },
      ] });
      const ledgerRepo = createMockLedgerRepo({
        findByPortfolioId: mockResolved([
          makeContributionEvent({ netAmount: 8000 }),
        ]),
      });
      const snapshot = makeSnapshot();
      const analyticsRepo = createMockAnalyticsRepo({ findLatestSnapshot: mockResolved(snapshot) });
      const portfolioRepo = createMockPortfolioRepo({ findById: mockResolved(portfolio) });
      const service = new AnalyticsService(createMockCtx(), analyticsRepo, portfolioRepo, ledgerRepo);
      const result = await service.getPerformanceSummary('p1');

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.totalInvested).toBe(8000);
        expect(result.value.currentValue).toBe(10000);
        expect(result.value.growthAmount).toBe(2000);
        expect(result.value.growthPercentage).toBe(25);
        expect(result.value.lastSnapshotDate).toBe(snapshot.snapshotDate.toISOString());
      }
    });

    it('returns null lastSnapshotDate when no snapshots exist', async () => {
      const portfolio = makePortfolio();
      const ledgerRepo = createMockLedgerRepo({ findByPortfolioId: mockResolved([]) });
      const analyticsRepo = createMockAnalyticsRepo({ findLatestSnapshot: mockResolved(null) });
      const portfolioRepo = createMockPortfolioRepo({ findById: mockResolved(portfolio) });
      const service = new AnalyticsService(createMockCtx(), analyticsRepo, portfolioRepo, ledgerRepo);
      const result = await service.getPerformanceSummary('p1');

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.lastSnapshotDate).toBeNull();
      }
    });
  });

  describe('getMonthlyReport', () => {
    it('returns combined report with impacts and performance', async () => {
      const portfolio = makePortfolio();
      const ledgerRepo = createMockLedgerRepo({
        findByPortfolioId: mockResolved([
          makeContributionEvent({ id: 'e1', netAmount: 1000, occurredAt: new Date('2025-05-10T12:00:00'), assetValueId: 'av1', assetClassName: 'crypto' }),
        ]),
      });
      const snapshot = makeSnapshot({
        snapshotDate: new Date('2025-05-01T12:00:00'),
        data: [
          { assetValueId: 'av1', assetClass: 'crypto', optionalTickerDescription: null, targetPercentage: 30, currentValue: 2000, realPercentage: 20, deviation: -10 },
          { assetValueId: 'av2', assetClass: 'fixed_income_post', optionalTickerDescription: null, targetPercentage: 70, currentValue: 8000, realPercentage: 80, deviation: 10 },
        ],
      });
      const snapshotAfter = makeSnapshot({
        id: 'snap2',
        snapshotDate: new Date('2025-05-20T12:00:00'),
        data: [
          { assetValueId: 'av1', assetClass: 'crypto', optionalTickerDescription: null, targetPercentage: 30, currentValue: 3000, realPercentage: 27, deviation: -3 },
          { assetValueId: 'av2', assetClass: 'fixed_income_post', optionalTickerDescription: null, targetPercentage: 70, currentValue: 8000, realPercentage: 73, deviation: 3 },
        ],
      });
      const analyticsRepo = createMockAnalyticsRepo({
        findSnapshotsByPortfolio: mockResolved([snapshot, snapshotAfter]),
        findLatestSnapshot: mockResolved(snapshotAfter),
      });
      const portfolioRepo = createMockPortfolioRepo({ findById: mockResolved(portfolio) });
      const service = new AnalyticsService(createMockCtx(), analyticsRepo, portfolioRepo, ledgerRepo);
      const result = await service.getMonthlyReport('p1', 2025, 5);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.year).toBe(2025);
        expect(result.value.month).toBe(5);
        expect(result.value.totalContributions).toBe(1000);
        expect(result.value.impacts).toHaveLength(1);
        expect(result.value.impacts[0].amount).toBe(1000);
        expect(result.value.impacts[0].eventType).toBe('INVESTMENT_CONTRIBUTION');
        expect(result.value.impacts[0].deviationBefore).toBe(-10);
        expect(result.value.impacts[0].deviationAfter).toBe(-3);
        expect(result.value.impacts[0].reduction).toBe(-7);
      }
    });
  });
});
