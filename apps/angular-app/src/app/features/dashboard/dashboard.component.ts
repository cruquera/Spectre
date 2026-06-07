import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import type { AllocationTimeSeriesDto, DashboardSummaryDto, MonthlyContributionSummaryDto, PerformanceSummaryDto } from '../../../types/spectre';
import { IpcService } from '../../core/services/ipc.service';
import { BarChartComponent } from '../../shared/charts/bar-chart.component';
import { LineChartComponent } from '../../shared/charts/line-chart.component';

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

@Component({
  imports: [BarChartComponent, FormsModule, LineChartComponent, RouterLink],
  standalone: true,
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  public get session(): { displayName: string; username: string } | null { return this.ipc.session(); }
  public readonly onboardingCompleted = signal(false);
  public readonly accountCount = signal(0);
  public readonly templateCount = signal(0);
  public readonly summary = signal<DashboardSummaryDto | null>(null);
  public readonly loading = signal(true);
  public readonly portfolios = signal<Array<{ id: string; templateId: string; name: string }>>([]);
  public readonly allocationHistory = signal<AllocationTimeSeriesDto | null>(null);
  public readonly contributionHistory = signal<MonthlyContributionSummaryDto[]>([]);
  public readonly performance = signal<PerformanceSummaryDto | null>(null);

  public readonly currencyFormatter = new Intl.NumberFormat('pt-BR', { currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency' });

  public readonly needsAttention = computed(() =>
    (this.summary()?.deviations ?? []).filter((d) => d.needsRebalance),
  );

  public readonly contributionChartData = computed(() =>
    this.contributionHistory().map((m) => ({
      label: `${String(m.month).padStart(2, '0')}/${m.year}`,
      value: m.totalContributions,
    })),
  );

  public readonly allocationLineSeries = computed(() => {
    const hist = this.allocationHistory();

    if (!hist || hist.series.length === 0) return [];

    const colors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16'];

    return hist.series[0].data.map((d, idx) => ({
      label: d.label,
      color: colors[idx % colors.length],
      data: hist.series.map((s) => {
        const point = s.data.find((p) => p.assetClass === d.assetClass);

        return { x: s.date, y: point?.percentage ?? 0 };
      }),
    }));
  });

  public getAssetClassLabel(value: string): string {
    return ASSET_CLASS_LABELS[value] ?? value;
  }

  public selectedPortfolioId = signal<string>('');

  public readonly hasPortfolios = computed(() => this.portfolios().length > 0);
  public readonly currentPortfolioId = computed(() => this.selectedPortfolioId() || this.portfolios()[0]?.id || '');

  public readonly chartColors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16'];

  private readonly ipc = inject(IpcService);

  public async ngOnInit(): Promise<void> {
    const onboardingRes = await this.ipc.onboarding.getState();

    if (onboardingRes.success) {
      this.onboardingCompleted.set(onboardingRes.data.status === 'COMPLETED');

      if (onboardingRes.data.status === 'COMPLETED') {
        await Promise.all([
          this.loadAccounts(),
          this.loadTemplates(),
          this.loadSummary(),
          this.loadPortfolios(),
        ]);
      }
    }
    this.loading.set(false);
  }

  public async selectPortfolio(portfolioId: string): Promise<void> {
    this.selectedPortfolioId.set(portfolioId);
    await Promise.all([
      this.loadAllocationHistory(portfolioId),
      this.loadContributionHistory(portfolioId),
      this.loadPerformance(portfolioId),
    ]);
  }

  private async loadAccounts(): Promise<void> {
    const res = await this.ipc.accounts.list();

    if (res.success) this.accountCount.set(res.data.length);
  }

  private async loadTemplates(): Promise<void> {
    const res = await this.ipc.portfolioTemplates.list();

    if (res.success) this.templateCount.set(res.data.length);
  }

  private async loadSummary(): Promise<void> {
    const res = await this.ipc.investmentPortfolio.getDashboardSummary();

    if (res.success) this.summary.set(res.data);
  }

  private async loadPortfolios(): Promise<void> {
    const res = await this.ipc.investmentPortfolio.list();

    if (res.success) {
      this.portfolios.set(res.data.map((p) => ({ id: p.id, templateId: p.templateId, name: p.name })));
      if (res.data.length > 0) {
        await this.selectPortfolio(res.data[0].id);
      }
    }
  }

  private async loadAllocationHistory(portfolioId: string): Promise<void> {
    const res = await this.ipc.analytics.getAllocationHistory(portfolioId);

    if (res.success) this.allocationHistory.set(res.data);
  }

  private async loadContributionHistory(portfolioId: string): Promise<void> {
    const res = await this.ipc.analytics.getContributionHistory(portfolioId);

    if (res.success) this.contributionHistory.set(res.data);
  }

  private async loadPerformance(portfolioId: string): Promise<void> {
    const res = await this.ipc.analytics.getPerformanceSummary(portfolioId);

    if (res.success) this.performance.set(res.data);
  }
}
