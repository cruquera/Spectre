import type { AnalyticsRepository } from './analytics-repository.js';
import type { AppContext } from '../../../shared/app-context.js';
import { AppError, type Result, err, ok } from '../../../shared/kernel/result.js';
import type { InvestmentPortfolioRepository } from '../../investment-portfolio/application/investment-portfolio-repository.js';
import type { LedgerEventRepository } from '../../ledger-event/application/ledger-event-repository.js';
import type { AllocationSnapshot, AllocationTimeSeries, AssetAllocation, ContributionImpact, MonthlyContributionSummary, MonthlyReport, PerformanceSummary } from '../domain/analytics.js';

const ASSET_CLASS_LABELS: Record<string, string> = {
  cash_reserve: 'Caixa e Reserva',
  fixed_income_post: 'Renda Fixa Pós-Fixada',
  fixed_income_pre: 'Renda Fixa Prefixada',
  fixed_income_inflation: 'Renda Fixa IPCA+',
  debentures: 'Debêntures',
  investment_funds: 'Fundos de Investimento',
  retirement_funds: 'Fundos Previdenciários',
  real_estate_funds: 'Fundos Imobiliários (FII)',
  etf_brazil: 'ETF Brasil',
  etf_global: 'ETF Internacional',
  stock_picking_b3: 'Stock Picking B3',
  stock_picking_nasdaq: 'Stock Picking NASDAQ',
  stock_picking_nyse: 'Stock Picking NYSE',
  stock_picking_europe: 'Stock Picking Europa',
  stock_picking_asia: 'Stock Picking Ásia',
  reits: 'REITs',
  commodities: 'Commodities',
  precious_metals: 'Ouro e Metais Preciosos',
  crypto: 'Criptomoedas',
  alternative_assets: 'Ativos Alternativos',
};

function getAssetClassLabel(value: string): string {
  return ASSET_CLASS_LABELS[value] ?? value;
}

export class AnalyticsService {
  public constructor(
    private readonly ctx: AppContext,
    private readonly repo: AnalyticsRepository,
    private readonly portfolioRepo: InvestmentPortfolioRepository,
    private readonly ledgerRepo: LedgerEventRepository,
  ) {}

  public async recordSnapshot(portfolioId: string): Promise<Result<{ id: string; snapshotDate: string }, AppError>> {
    try {
      this.ctx.requireSession();
      const portfolio = await this.portfolioRepo.findById(portfolioId);

      if (!portfolio) return err(new AppError('PORTFOLIO_NOT_FOUND', 'Portfolio not found'));

      const totalValue = portfolio.assetValues.reduce((s, av) => s + av.currentValue, 0);
      const allocations: AssetAllocation[] = portfolio.assetValues.map((av) => {
        const realPercentage = totalValue > 0 ? (av.currentValue / totalValue) * 100 : 0;

        return {
          assetValueId: av.id,
          assetClass: av.assetClass,
          optionalTickerDescription: av.optionalTickerDescription,
          targetPercentage: av.targetPercentage,
          currentValue: av.currentValue,
          realPercentage: Math.round(realPercentage * 100) / 100,
          deviation: totalValue > 0 ? Math.round((realPercentage - av.targetPercentage) * 100) / 100 : 0,
        };
      });

      const snapshot = await this.repo.saveSnapshot({
        portfolioId,
        snapshotDate: new Date(),
        totalValue: Math.round(totalValue * 100) / 100,
        data: allocations,
      });

      return ok({
        id: snapshot.id,
        snapshotDate: snapshot.snapshotDate.toISOString(),
      });
    } catch (e) {
      return err(new AppError('RECORD_SNAPSHOT_FAILED', e instanceof Error ? e.message : 'Unknown error'));
    }
  }

  public async getAllocationHistory(portfolioId: string): Promise<Result<AllocationTimeSeries, AppError>> {
    try {
      const portfolio = await this.portfolioRepo.findById(portfolioId);

      if (!portfolio) return err(new AppError('PORTFOLIO_NOT_FOUND', 'Portfolio not found'));

      const snapshots = await this.repo.findSnapshotsByPortfolio(portfolioId);

      const series: AllocationTimeSeries['series'] = snapshots.map((s) => ({
        date: s.snapshotDate.toISOString().split('T')[0],
        data: s.data.map((a) => ({
          assetClass: a.assetClass,
          label: getAssetClassLabel(a.assetClass),
          percentage: a.realPercentage,
          value: a.currentValue,
        })),
      }));

      if (series.length === 0) {
        const currentAllocations = portfolio.assetValues.map((av) => {
          const total = portfolio.assetValues.reduce((s, a) => s + a.currentValue, 0);
          const realPct = total > 0 ? (av.currentValue / total) * 100 : 0;

          return {
            assetValueId: av.id,
            assetClass: av.assetClass,
            optionalTickerDescription: av.optionalTickerDescription,
            targetPercentage: av.targetPercentage,
            currentValue: av.currentValue,
            realPercentage: Math.round(realPct * 100) / 100,
            deviation: total > 0 ? Math.round((realPct - av.targetPercentage) * 100) / 100 : 0,
          };
        });

        series.push({
          date: new Date().toISOString().split('T')[0],
          data: currentAllocations.map((a) => ({
            assetClass: a.assetClass,
            label: getAssetClassLabel(a.assetClass),
            percentage: a.realPercentage,
            value: a.currentValue,
          })),
        });
      }

      return ok({
        portfolioId: portfolio.id,
        portfolioName: portfolio.name,
        series,
      });
    } catch (e) {
      return err(new AppError('ALLOCATION_HISTORY_FAILED', e instanceof Error ? e.message : 'Unknown error'));
    }
  }

  public async getContributionHistory(portfolioId: string): Promise<Result<MonthlyContributionSummary[], AppError>> {
    try {
      const events = await this.ledgerRepo.findByPortfolioId(portfolioId);
      const contributions = events.filter((e) => e.eventType === 'INVESTMENT_CONTRIBUTION');

      const byMonth = new Map<string, { total: number; assets: Map<string, { amount: number; count: number; label: string }> }>();

      for (const c of contributions) {
        const date = new Date(c.occurredAt);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const month = byMonth.get(key) ?? { total: 0, assets: new Map() };

        month.total += c.netAmount;
        const assetKey = c.assetClassName ?? 'unknown';
        const asset = month.assets.get(assetKey) ?? { amount: 0, count: 0, label: assetKey };

        asset.amount += c.netAmount;
        asset.count += 1;
        month.assets.set(assetKey, asset);
        byMonth.set(key, month);
      }

      const result: MonthlyContributionSummary[] = [];

      for (const [key, data] of byMonth) {
        const [yearStr, monthStr] = key.split('-');

        result.push({
          year: Number(yearStr),
          month: Number(monthStr),
          totalContributions: Math.round(data.total * 100) / 100,
          contributionsByAsset: Array.from(data.assets.entries()).map(([assetClass, info]) => ({
            assetClass,
            label: info.label,
            amount: Math.round(info.amount * 100) / 100,
            count: info.count,
          })),
        });
      }

      result.sort((a, b) => a.year - b.year || a.month - b.month);

      return ok(result);
    } catch (e) {
      return err(new AppError('CONTRIBUTION_HISTORY_FAILED', e instanceof Error ? e.message : 'Unknown error'));
    }
  }

  public async getMonthlyReport(portfolioId: string, year: number, month: number): Promise<Result<MonthlyReport, AppError>> {
    try {
      const [performanceResult, impactsResult] = await Promise.all([
        this.getPerformanceSummary(portfolioId),
        this.getMonthlyImpacts(portfolioId, year, month),
      ]);

      if (!performanceResult.ok) return err(performanceResult.error);
      if (!impactsResult.ok) return err(impactsResult.error);

      return ok({
        year,
        month,
        totalContributions: impactsResult.value.reduce((s, i) => s + i.amount, 0),
        performance: performanceResult.value,
        impacts: impactsResult.value,
      });
    } catch (e) {
      return err(new AppError('MONTHLY_REPORT_FAILED', e instanceof Error ? e.message : 'Unknown error'));
    }
  }

  public async getPerformanceSummary(portfolioId: string): Promise<Result<PerformanceSummary, AppError>> {
    try {
      const portfolio = await this.portfolioRepo.findById(portfolioId);

      if (!portfolio) return err(new AppError('PORTFOLIO_NOT_FOUND', 'Portfolio not found'));

      const events = await this.ledgerRepo.findByPortfolioId(portfolioId);
      const totalInvested = events
        .filter((e) => e.eventType === 'INVESTMENT_CONTRIBUTION')
        .reduce((s, e) => s + e.netAmount, 0);

      const currentValue = portfolio.assetValues.reduce((s, av) => s + av.currentValue, 0);
      const growthAmount = currentValue - totalInvested;
      const growthPercentage = totalInvested > 0 ? (growthAmount / totalInvested) * 100 : 0;

      const latest = await this.repo.findLatestSnapshot(portfolioId);

      return ok({
        portfolioId: portfolio.id,
        portfolioName: portfolio.name,
        totalInvested: Math.round(totalInvested * 100) / 100,
        currentValue: Math.round(currentValue * 100) / 100,
        growthAmount: Math.round(growthAmount * 100) / 100,
        growthPercentage: Math.round(growthPercentage * 100) / 100,
        lastSnapshotDate: latest ? latest.snapshotDate.toISOString() : null,
      });
    } catch (e) {
      return err(new AppError('PERFORMANCE_SUMMARY_FAILED', e instanceof Error ? e.message : 'Unknown error'));
    }
  }

  private async getMonthlyImpacts(portfolioId: string, year: number, month: number): Promise<Result<ContributionImpact[], AppError>> {
    try {
      const events = await this.ledgerRepo.findByPortfolioId(portfolioId);
      const snapshots = await this.repo.findSnapshotsByPortfolio(portfolioId);

      const monthEvents = events.filter((e) => {
        const d = new Date(e.occurredAt);

        return d.getFullYear() === year && d.getMonth() + 1 === month;
      });

      const impacts: ContributionImpact[] = [];

      for (const event of monthEvents) {
        const before = this.findDeviationBefore(event.occurredAt, event.assetValueId, snapshots);
        const after = this.findDeviationAfter(event.occurredAt, event.assetValueId, snapshots);

        impacts.push({
          eventId: event.id,
          eventDate: event.occurredAt.toISOString(),
          eventType: event.eventType,
          amount: Math.round(event.netAmount * 100) / 100,
          assetClass: event.assetClassName ?? 'unknown',
          deviationBefore: before,
          deviationAfter: after,
          reduction: Math.round((before - after) * 100) / 100,
        });
      }

      return ok(impacts);
    } catch (e) {
      return err(new AppError('MONTHLY_IMPACTS_FAILED', e instanceof Error ? e.message : 'Unknown error'));
    }
  }

  private findDeviationBefore(date: Date, assetValueId: string, snapshots: AllocationSnapshot[]): number {
    const before = snapshots
      .filter((s) => s.snapshotDate <= date)
      .sort((a, b) => b.snapshotDate.getTime() - a.snapshotDate.getTime())[0];

    if (!before) return 0;
    const alloc = before.data.find((a) => a.assetValueId === assetValueId);

    return alloc?.deviation ?? 0;
  }

  private findDeviationAfter(date: Date, assetValueId: string, snapshots: AllocationSnapshot[]): number {
    const after = snapshots
      .filter((s) => s.snapshotDate > date)
      .sort((a, b) => a.snapshotDate.getTime() - b.snapshotDate.getTime())[0];

    if (!after) return 0;
    const alloc = after.data.find((a) => a.assetValueId === assetValueId);

    return alloc?.deviation ?? 0;
  }
}
