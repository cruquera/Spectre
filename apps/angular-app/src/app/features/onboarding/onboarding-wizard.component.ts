import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { IpcService } from '../../core/services/ipc.service';
import { PortfolioTemplateStore } from '../../core/stores/portfolio-template.store';

const ASSET_CLASSES = [
  { value: 'cash_reserve', label: 'Caixa e Reserva' },
  { value: 'fixed_income_post', label: 'Renda Fixa Pós-Fixada' },
  { value: 'fixed_income_pre', label: 'Renda Fixa Prefixada' },
  { value: 'fixed_income_inflation', label: 'Renda Fixa IPCA+' },
  { value: 'debentures', label: 'Debêntures' },
  { value: 'investment_funds', label: 'Fundos de Investimento' },
  { value: 'retirement_funds', label: 'Fundos Previdenciários' },
  { value: 'real_estate_funds', label: 'Fundos Imobiliários (FII)' },
  { value: 'etf_brazil', label: 'ETF Brasil' },
  { value: 'etf_global', label: 'ETF Internacional' },
  { value: 'stock_picking_b3', label: 'Stock Picking B3 (IBOVESPA)' },
  { value: 'stock_picking_nasdaq', label: 'Stock Picking NASDAQ' },
  { value: 'stock_picking_nyse', label: 'Stock Picking NYSE' },
  { value: 'stock_picking_europe', label: 'Stock Picking Europa' },
  { value: 'stock_picking_asia', label: 'Stock Picking Ásia' },
  { value: 'reits', label: 'REITs' },
  { value: 'commodities', label: 'Commodities' },
  { value: 'precious_metals', label: 'Ouro e Metais Preciosos' },
  { value: 'crypto', label: 'Criptomoedas' },
  { value: 'alternative_assets', label: 'Ativos Alternativos' },
] as const;

type Account_ = { id: string; institutionName: string; nickname: string; currency: string };

@Component({
  imports: [FormsModule],
  standalone: true,
  templateUrl: './onboarding-wizard.component.html',
})
export class OnboardingWizardComponent implements OnInit {
  public readonly steps = [
    { label: 'Cadastro de Contas', number: 1 },
    { label: 'Estratégia da Carteira', number: 2 },
    { label: 'Projeto de Carteira', number: 3 },
    { label: 'Resumo da Carteira', number: 4 },
  ];

  public readonly institutions = [
    'Banco Inter', 'Banco Safra', 'Nubank', 'Nomad', 'Banco Inter Global',
  ] as const;

  public readonly assetClasses = ASSET_CLASSES;

  public readonly strategies = [
    {
      description: 'Defina diretamente o percentual de cada investimento da carteira.',
      key: 'FREE_ALLOCATION',
      label: 'Livre (Recomendado)',
      recommended: true,
    },
    {
      description: 'Organize categorias e depois distribua os ativos dentro delas.',
      key: 'ASSET_CLASS_ALLOCATION',
      label: 'Por Classe de Ativo',
      recommended: false,
    },
  ] as const;

  public readonly accounts = signal<Account_[]>([]);
  public readonly currentStep = signal(1);
  public readonly chosenStrategy = signal<string>('FREE_ALLOCATION');
  public readonly saving = signal(false);

  public institutionName = '';
  public nickname = '';
  public currency = 'BRL';

  public templateName = '';
  public templateDescription = '';

  public targetClass = '';
  public targetTicker = '';
  public targetPercentage = 0;

  public expandedParentIndex = signal(-1);
  public subTicker = '';
  public subPercentage = 0;
  public editingIndex = signal(-1);
  public editValue = signal(0);

  public store = inject(PortfolioTemplateStore);
  private readonly ipc = inject(IpcService);
  private readonly router = inject(Router);

  public readonly isFreeAllocation = computed(() => this.chosenStrategy() === 'FREE_ALLOCATION');

  public readonly subTotalError = computed(() => {
    const idx = this.expandedParentIndex();

    if (idx < 0 || idx >= this.store.targets().length) return null;
    const subs = this.store.targets()[idx].subTargets;

    if (!subs || subs.length === 0) return null;
    const sum = subs.reduce((s, t) => s + t.allocationPercentage, 0);

    if (Math.abs(sum - 100) < 0.01) return null;

    return `Sub-total: ${sum.toFixed(1)}% — deve ser exatamente 100%`;
  });

  public readonly effectivePreview = computed(() => {
    if (this.isFreeAllocation() || this.store.targets().length === 0) return [];
    const result: Array<{ label: string; pct: number }> = [];

    for (const t of this.store.targets()) {
      if (t.subTargets && t.subTargets.length > 0) {
        for (const st of t.subTargets) {
          const effective = (t.allocationPercentage / 100) * st.allocationPercentage;

          result.push({ label: st.optionalTickerDescription || this.getAssetClassLabel(t.assetClass), pct: effective });
        }
      }
    }

    return result;
  });

  public get isFirstStep(): boolean {
    return this.currentStep() === 1;
  }

  public get isLastStep(): boolean {
    return this.currentStep() === this.steps.length;
  }

  public getAssetClassLabel(value: string): string {
    return ASSET_CLASSES.find((a) => a.value === value)?.label ?? value;
  }

  public async ngOnInit(): Promise<void> {
    const stateRes = await this.ipc.onboarding.getState();

    if (stateRes.success && stateRes.data.status === 'IN_PROGRESS') {
      this.currentStep.set(stateRes.data.currentStep || 1);
    }
    await this.loadAccounts();
  }

  public async addAccount(): Promise<void> {
    if (!this.institutionName || !this.nickname || !this.currency) return;
    this.saving.set(true);
    try {
      const res = await this.ipc.accounts.create({
        institutionName: this.institutionName,
        nickname: this.nickname,
        currency: this.currency,
      });

      if (res.success) {
        this.accounts.update((list) => [...list, res.data]);
        this.institutionName = '';
        this.nickname = '';
        this.currency = 'BRL';
      }
    } finally {
      this.saving.set(false);
    }
  }

  public async removeAccount(id: string): Promise<void> {
    const res = await this.ipc.accounts.delete(id);

    if (res.success) {
      this.accounts.update((list) => list.filter((a) => a.id !== id));
    }
  }

  public fillTickerFromClass(): void {
    const ac = ASSET_CLASSES.find((a) => a.value === this.targetClass);

    if (ac) this.targetTicker = ac.label;
  }

  public addTarget(): void {
    if (!this.targetClass || this.targetPercentage <= 0) return;
    this.store.addTarget({
      assetClass: this.targetClass,
      optionalTickerDescription: this.isFreeAllocation() ? this.targetTicker.trim() : '',
      allocationPercentage: this.targetPercentage,
    });
    this.targetClass = '';
    this.targetTicker = '';
    this.targetPercentage = 0;
  }

  public removeTarget(index: number): void {
    this.store.removeTarget(index);
    if (this.expandedParentIndex() === index) {
      this.expandedParentIndex.set(-1);
    } else if (this.expandedParentIndex() > index) {
      this.expandedParentIndex.update((i) => i - 1);
    }
  }

  public startEdit(index: number): void {
    this.editingIndex.set(index);
    this.editValue.set(this.store.targets()[index].allocationPercentage);
  }

  public saveEdit(): void {
    const idx = this.editingIndex();

    if (idx < 0 || this.editValue() <= 0 || this.editValue() > 100) return;
    this.store.updateTargetPercentage(idx, this.editValue());
    this.editingIndex.set(-1);
  }

  public cancelEdit(): void {
    this.editingIndex.set(-1);
  }

  public toggleExpand(index: number): void {
    this.expandedParentIndex.update((i) => (i === index ? -1 : index));
    this.subTicker = '';
    this.subPercentage = 0;
  }

  public addSubTarget(): void {
    const idx = this.expandedParentIndex();

    if (idx < 0 || !this.subTicker.trim() || this.subPercentage <= 0) return;
    this.store.addSubTarget(idx, {
      assetClass: this.store.targets()[idx].assetClass,
      optionalTickerDescription: this.subTicker.trim(),
      allocationPercentage: this.subPercentage,
    });
    this.subTicker = '';
    this.subPercentage = 0;
  }

  public removeSubTarget(parentIndex: number, childIndex: number): void {
    this.store.removeSubTarget(parentIndex, childIndex);
  }

  public async nextStep(): Promise<void> {
    if (this.isFirstStep && this.accounts().length === 0) return;
    if (this.currentStep() === 2) {
      await this.ipc.onboarding.updateStep({ step: 2 });
    }
    if (this.currentStep() === 3) {
      this.store.meta.update((m) => ({
        ...m,
        name: this.templateName,
        description: this.templateDescription,
        strategy: this.chosenStrategy(),
      }));
    }
    if (this.isLastStep) {
      await this.completeOnboarding();
    } else {
      this.currentStep.update((s) => s + 1);
    }
  }

  public prevStep(): void {
    if (this.isFirstStep) return;
    this.currentStep.update((s) => s - 1);
  }

  public async exitOnboarding(): Promise<void> {
    await this.ipc.onboarding.abort();
    await this.router.navigate(['/']);
  }

  private async loadAccounts(): Promise<void> {
    const res = await this.ipc.accounts.list();

    if (res.success) this.accounts.set(res.data);
  }

  private async completeOnboarding(): Promise<void> {
    const targets = this.store.targets();

    if (targets.length > 0 && this.store.canFinish()) {
      const meta = this.store.meta();

      await this.ipc.portfolioTemplates.create({
        name: meta.name || 'Minha Carteira',
        description: meta.description || null,
        strategy: this.chosenStrategy(),
        baseCurrency: meta.baseCurrency,
        isDefault: true,
        targets: this.store.flattenTargets().map((f) => ({
          assetClass: f.assetClass,
          optionalTickerDescription: f.ticker || null,
          allocationPercentage: f.allocationPercentage,
          classTargetId: f.classTargetId ?? null,
        })),
      });
    }
    await this.ipc.onboarding.complete();
    await this.router.navigate(['/dashboard']);
  }
}
