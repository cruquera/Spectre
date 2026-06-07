import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { InvestmentPortfolioDto } from '../../../types/spectre';
import { IpcService } from '../../core/services/ipc.service';

@Component({
  imports: [RouterLink],
  standalone: true,
  template: `
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold">Carteiras de Investimento</h2>
    </div>

    @if (loading()) {
      <div class="bg-spectre-surface rounded border border-slate-700 p-8 text-center">
        <p class="text-slate-400">Carregando...</p>
      </div>
    } @else if (portfolios().length === 0) {
      <div class="bg-spectre-surface rounded border border-slate-700 p-8 text-center">
        <p class="text-slate-400 mb-4">Nenhuma carteira criada ainda.</p>
        <p class="text-sm text-slate-500 mb-4">
          Crie um projeto de carteira no onboarding e depois volte aqui para gerenciar.
        </p>
        <a routerLink="/portfolio-templates" class="text-spectre-accent text-sm hover:underline">
          Ver Projetos de Carteira
        </a>
      </div>
    } @else {
      <div class="grid gap-4">
        @for (p of portfolios(); track p.id) {
          <div class="bg-spectre-surface rounded border border-slate-700 p-4 flex items-center justify-between">
            <div>
              <h3 class="font-semibold">{{ p.name }}</h3>
              <p class="text-sm text-slate-400">{{ p.assetValues.length }} ativos</p>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-sm text-slate-400">{{ p.status }}</span>
              <a [routerLink]="['/investment-portfolio', p.templateId]" class="text-spectre-accent text-sm hover:underline">
                Ver detalhes
              </a>
            </div>
          </div>
        }
      </div>
    }
  `,
})
export class PortfolioListComponent implements OnInit {
  public readonly portfolios = signal<InvestmentPortfolioDto[]>([]);
  public readonly loading = signal(true);

  private readonly ipc = inject(IpcService);

  public async ngOnInit(): Promise<void> {
    const res = await this.ipc.investmentPortfolio.list();

    if (res.success) {
      this.portfolios.set(res.data);
    }
    this.loading.set(false);
  }
}
