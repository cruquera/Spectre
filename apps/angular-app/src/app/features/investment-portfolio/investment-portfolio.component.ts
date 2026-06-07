import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import type { AllocationTimeSeriesDto, InvestmentPortfolioDto, LedgerEventDto, PerformanceSummaryDto } from '../../../types/spectre';
import { IpcService } from '../../core/services/ipc.service';
import { BarChartComponent } from '../../shared/charts/bar-chart.component';
import { LineChartComponent, type LineChartSeries } from '../../shared/charts/line-chart.component';

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

const EVENT_TYPE_LABELS: Record<string, string> = {
  INVESTMENT_CONTRIBUTION: 'Aporte',
  ASSET_PURCHASE: 'Compra',
  ASSET_SALE: 'Venda',
  DIVIDEND_INCOME: 'Dividendo',
  INTEREST_INCOME: 'Juros',
  CRYPTO_STAKING: 'Staking',
  MANUAL_ADJUSTMENT: 'Ajuste Manual',
};

@Component({
  imports: [BarChartComponent, LineChartComponent, RouterLink],
  standalone: true,
  template: `
    <div class="mb-6">
      <a routerLink="/portfolio-templates" class="text-sm text-spectre-accent hover:underline">&larr; Voltar para Projetos</a>
    </div>

    @if (loading()) {
      <div class="bg-spectre-surface rounded border border-slate-700 p-8 text-center">
        <p class="text-slate-400">Carregando...</p>
      </div>
    } @else if (!portfolio()) {
      <div class="bg-spectre-surface rounded border border-slate-700 p-8 text-center">
        <h2 class="text-xl font-semibold mb-2">Carteira não encontrada</h2>
        <p class="text-slate-400 mb-4">Esta carteira ainda não foi criada.</p>
        <button
          (click)="createPortfolio()"
          [disabled]="creating()"
          class="bg-spectre-accent text-white px-6 py-3 rounded font-medium hover:opacity-90 disabled:opacity-50"
        >
          {{ creating() ? 'Criando...' : 'Criar Carteira a partir do Template' }}
        </button>
      </div>
    } @else {
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold mb-1">{{ portfolio()!.name }}</h2>
          <p class="text-sm text-slate-400">{{ portfolio()!.assetValues.length }} ativos</p>
        </div>
      </div>

      <div class="bg-spectre-surface rounded border border-slate-700 p-6 mb-6">
        <h3 class="text-sm font-medium text-slate-400 mb-4">Alocação vs Target</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-slate-500 text-xs uppercase text-left">
                <th class="pb-3 pr-4">Ativo</th>
                <th class="pb-3 pr-4 text-right">Target</th>
                <th class="pb-3 pr-4 text-right">Valor Atual</th>
                <th class="pb-3 pr-4 text-right">% Real</th>
                <th class="pb-3 pr-4 text-right">Desvio</th>
                <th class="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              @for (av of portfolio()!.assetValues; track av.id) {
                <tr class="border-t border-slate-700">
                  <td class="py-3 pr-4">
                    <span class="text-white font-medium">{{ getAssetClassLabel(av.assetClass) }}</span>
                    @if (av.optionalTickerDescription) {
                      <span class="text-xs text-slate-400 ml-1">({{ av.optionalTickerDescription }})</span>
                    }
                  </td>
                  <td class="py-3 pr-4 text-right text-slate-300">{{ av.targetPercentage }}%</td>
                  <td class="py-3 pr-4 text-right text-slate-300">{{ currencyFormatter.format(av.currentValue) }}</td>
                  <td class="py-3 pr-4 text-right" [class.text-green-400]="av.currentValue > 0">
                    {{ av.currentValue > 0 ? (getRealPercent(av.id) + '%') : '-' }}
                  </td>
                  <td class="py-3 pr-4 text-right" [class.text-green-400]="!needsRebalance(av)" [class.text-red-400]="needsRebalance(av)">
                    {{ av.currentValue > 0 ? (getDeviationNumber(av.id) >= 0 ? '+' : '') + getDeviation(av.id) + '%' : '-' }}
                  </td>
                  <td class="py-3">
                    @if (needsRebalance(av)) {
                      <span class="text-red-400 text-xs font-medium">Rebalancear</span>
                    } @else {
                      <span class="text-green-400 text-xs font-medium">OK</span>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <div class="flex gap-4 border-b border-slate-700 mb-6">
        @for (tab of tabs; track tab.key) {
          <button
            (click)="activeTab.set(tab.key)"
            class="pb-3 text-sm font-medium transition-colors"
            [class.text-spectre-accent]="activeTab() === tab.key"
            [class.text-slate-400]="activeTab() !== tab.key"
            [class.border-b-2]="activeTab() === tab.key"
            [class.border-spectre-accent]="activeTab() === tab.key"
          >
            {{ tab.label }}
          </button>
        }
      </div>

      @switch (activeTab()) {
        @case ('events') {
          @if (events().length > 0) {
            <div class="bg-spectre-surface rounded border border-slate-700 p-6">
              <h3 class="text-sm font-medium text-slate-400 mb-4">Eventos</h3>
              <div class="space-y-2">
                @for (e of events(); track e.id) {
                  <div class="flex items-center justify-between bg-slate-800 rounded px-4 py-3">
                    <div class="flex items-center gap-3">
                      <span class="text-xs font-medium uppercase text-slate-400">{{ getEventTypeLabel(e.eventType) }}</span>
                      <span class="text-sm text-slate-300">{{ e.assetClassName ?? '-' }}</span>
                      @if (e.accountName) {
                        <span class="text-xs text-slate-500">{{ e.accountName }}</span>
                      }
                    </div>
                    <div class="text-right">
                      <span class="text-sm font-bold text-white">{{ currencyFormatter.format(e.netAmount) }}</span>
                      <span class="text-xs text-slate-500 ml-2">{{ formatDate(e.occurredAt) }}</span>
                    </div>
                  </div>
                }
              </div>
            </div>
          } @else {
            <div class="bg-spectre-surface rounded border border-slate-700 p-6 text-center">
              <p class="text-sm text-slate-400">Nenhum evento registrado.</p>
            </div>
          }
        }

        @case ('analytics') {
          <div class="space-y-6">
            <div class="bg-spectre-surface rounded border border-slate-700 p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-medium text-slate-400">Snapshot de Alocação</h3>
                <button
                  (click)="recordSnapshot()"
                  [disabled]="snapshotLoading()"
                  class="bg-spectre-accent text-white px-4 py-1.5 rounded text-sm font-medium hover:opacity-90 disabled:opacity-50"
                >
                  {{ snapshotLoading() ? 'Salvando...' : 'Registrar Snapshot' }}
                </button>
              </div>
              @if (lastSnapshotDate()) {
                <p class="text-xs text-slate-500">Último snapshot: {{ lastSnapshotDate() }}</p>
              } @else {
                <p class="text-sm text-slate-500">Registre snapshots periódicos para acompanhar a evolução da alocação.</p>
              }
            </div>

            <div class="bg-spectre-surface rounded border border-slate-700 p-6">
              <h3 class="text-sm font-medium text-slate-400 mb-4">Evolução da Alocação</h3>
              <sp-line-chart [series]="allocationLineSeries()" [height]="220" [width]="600" />
              @if (allocationLineSeries().length > 0) {
                <div class="flex flex-wrap gap-2 mt-3">
                  @for (s of allocationLineSeries(); track s.label) {
                    <span class="flex items-center gap-1 text-xs text-slate-400">
                      <span class="w-2 h-2 rounded-full inline-block" [style.background]="s.color"></span>
                      {{ s.label }}
                    </span>
                  }
                </div>
              }
            </div>

            @if (performance()) {
              <div class="bg-spectre-surface rounded border border-slate-700 p-6">
                <h3 class="text-sm font-medium text-slate-400 mb-4">Performance</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span class="text-xs text-slate-500 block">Total Investido</span>
                    <span class="text-lg font-bold text-white">{{ currencyFormatter.format(performance()!.totalInvested) }}</span>
                  </div>
                  <div>
                    <span class="text-xs text-slate-500 block">Valor Atual</span>
                    <span class="text-lg font-bold text-white">{{ currencyFormatter.format(performance()!.currentValue) }}</span>
                  </div>
                  <div>
                    <span class="text-xs text-slate-500 block">Crescimento</span>
                    <span class="text-lg font-bold" [class.text-green-400]="performance()!.growthAmount >= 0" [class.text-red-400]="performance()!.growthAmount < 0">
                      {{ currencyFormatter.format(performance()!.growthAmount) }}
                    </span>
                  </div>
                  <div>
                    <span class="text-xs text-slate-500 block">Rentabilidade</span>
                    <span class="text-lg font-bold" [class.text-green-400]="performance()!.growthPercentage >= 0" [class.text-red-400]="performance()!.growthPercentage < 0">
                      {{ performance()!.growthPercentage >= 0 ? '+' : '' }}{{ performance()!.growthPercentage }}%
                    </span>
                  </div>
                </div>
              </div>
            }

            @if (contributionData().length > 0) {
              <div class="bg-spectre-surface rounded border border-slate-700 p-6">
                <h3 class="text-sm font-medium text-slate-400 mb-4">Aportes Mensais</h3>
                <sp-bar-chart [items]="contributionData()" [currency]="true" />
              </div>
            }
          </div>
        }
      }
    }
  `,
})
export class InvestmentPortfolioComponent implements OnInit {
  public readonly portfolio = signal<InvestmentPortfolioDto | null>(null);
  public readonly events = signal<LedgerEventDto[]>([]);
  public readonly loading = signal(true);
  public readonly creating = signal(false);
  public readonly activeTab = signal<'allocation' | 'events' | 'analytics'>('allocation');
  public readonly tabs = [
    { key: 'allocation' as const, label: 'Alocação' },
    { key: 'events' as const, label: 'Eventos' },
    { key: 'analytics' as const, label: 'Analytics' },
  ];

  public readonly allocationHistory = signal<AllocationTimeSeriesDto | null>(null);
  public readonly performance = signal<PerformanceSummaryDto | null>(null);
  public readonly contributionData = signal<Array<{ label: string; value: number }>>([]);
  public readonly snapshotLoading = signal(false);
  public readonly lastSnapshotDate = signal<string | null>(null);

  public readonly chartColors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16'];

  public readonly allocationLineSeries = computed<LineChartSeries[]>(() => {
    const hist = this.allocationHistory();

    if (!hist || hist.series.length === 0) return [];

    return hist.series[0].data.map((d, idx) => ({
      label: d.label,
      color: this.chartColors[idx % this.chartColors.length],
      data: hist.series.map((s) => {
        const point = s.data.find((p) => p.assetClass === d.assetClass);

        return { x: s.date, y: point?.percentage ?? 0 };
      }),
    }));
  });

  public readonly currencyFormatter = new Intl.NumberFormat('pt-BR', { currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency' });

  private readonly ipc = inject(IpcService);
  private readonly route = inject(ActivatedRoute);

  private get templateId(): string {
    return this.route.snapshot.paramMap.get('templateId') ?? '';
  }

  public getAssetClassLabel(value: string): string {
    return ASSET_CLASS_LABELS[value] ?? value;
  }

  public getEventTypeLabel(value: string): string {
    return EVENT_TYPE_LABELS[value] ?? value;
  }

  public getRealPercent(assetValueId: string): string {
    const p = this.portfolio();

    if (!p) return '0';
    const total = p.assetValues.reduce((s, av) => s + av.currentValue, 0);

    if (total === 0) return '0';
    const av = p.assetValues.find((a) => a.id === assetValueId);

    if (!av) return '0';

    return ((av.currentValue / total) * 100).toFixed(1);
  }

  public getDeviationNumber(assetValueId: string): number {
    const p = this.portfolio();

    if (!p) return 0;
    const total = p.assetValues.reduce((s, av) => s + av.currentValue, 0);

    if (total === 0) return 0;
    const av = p.assetValues.find((a) => a.id === assetValueId);

    if (!av) return 0;
    const realPercent = (av.currentValue / total) * 100;

    return Math.round((realPercent - av.targetPercentage) * 10) / 10;
  }

  public getDeviation(assetValueId: string): string {
    return this.getDeviationNumber(assetValueId).toFixed(1);
  }

  public needsRebalance(av: { id: string; targetPercentage: number; currentValue: number }): boolean {
    const total = this.portfolio()?.assetValues.reduce((s, a) => s + a.currentValue, 0) ?? 0;

    if (total === 0) return false;
    const realPercent = (av.currentValue / total) * 100;

    return Math.abs(realPercent - av.targetPercentage) > 5;
  }

  public formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  }

  public async createPortfolio(): Promise<void> {
    this.creating.set(true);
    try {
      const res = await this.ipc.investmentPortfolio.createFromTemplate(this.templateId);

      if (res.success) {
        this.portfolio.set(res.data);
        await this.loadEvents();
        await this.loadAnalytics();
      }
    } finally {
      this.creating.set(false);
    }
  }

  public async recordSnapshot(): Promise<void> {
    const p = this.portfolio();

    if (!p) return;
    this.snapshotLoading.set(true);
    try {
      const res = await this.ipc.analytics.recordSnapshot(p.id);

      if (res.success) {
        this.lastSnapshotDate.set(new Date(res.data.snapshotDate).toLocaleString('pt-BR'));
        await this.loadAnalytics();
      }
    } finally {
      this.snapshotLoading.set(false);
    }
  }

  public async ngOnInit(): Promise<void> {
    await this.loadPortfolio();
    this.loading.set(false);
  }

  private async loadPortfolio(): Promise<void> {
    const listRes = await this.ipc.investmentPortfolio.list();

    if (listRes.success) {
      const found = listRes.data.find((p) => p.templateId === this.templateId);

      if (found) {
        const detailRes = await this.ipc.investmentPortfolio.findById(found.id);

        if (detailRes.success && detailRes.data) {
          this.portfolio.set(detailRes.data);
          await Promise.all([
            this.loadEvents(),
            this.loadAnalytics(),
          ]);
        }
      }
    }
  }

  private async loadEvents(): Promise<void> {
    const p = this.portfolio();

    if (!p) return;
    const res = await this.ipc.ledgerEvents.listByPortfolio(p.id);

    if (res.success) this.events.set(res.data);
  }

  private async loadAnalytics(): Promise<void> {
    const p = this.portfolio();

    if (!p) return;
    const [histRes, perfRes, contribRes] = await Promise.all([
      this.ipc.analytics.getAllocationHistory(p.id),
      this.ipc.analytics.getPerformanceSummary(p.id),
      this.ipc.analytics.getContributionHistory(p.id),
    ]);

    if (histRes.success) this.allocationHistory.set(histRes.data);
    if (perfRes.success) {
      this.performance.set(perfRes.data);
      this.lastSnapshotDate.set(perfRes.data.lastSnapshotDate ? new Date(perfRes.data.lastSnapshotDate).toLocaleString('pt-BR') : null);
    }
    if (contribRes.success) {
      this.contributionData.set(contribRes.data.map((m) => ({
        label: `${String(m.month).padStart(2, '0')}/${m.year}`,
        value: m.totalContributions,
      })));
    }
  }
}
