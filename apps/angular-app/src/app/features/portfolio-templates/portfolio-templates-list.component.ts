import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { IpcService } from '../../core/services/ipc.service';

@Component({
  imports: [RouterLink],
  standalone: true,
  template: `
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold">Projetos de Carteira</h2>
    </div>

    @if (loading()) {
      <div class="bg-spectre-surface rounded border border-slate-700 p-8 text-center">
        <p class="text-slate-400">Carregando...</p>
      </div>
    } @else if (templates().length === 0) {
      <div class="bg-spectre-surface rounded border border-slate-700 p-8 text-center">
        <p class="text-slate-400 mb-4">Nenhum projeto cadastrado.</p>
        <p class="text-sm text-slate-500">
          Complete o onboarding para criar seu primeiro projeto de carteira.
        </p>
      </div>
    } @else {
      <div class="grid gap-4">
        @for (t of templates(); track t.id) {
          <div class="bg-spectre-surface rounded border border-slate-700 p-4 flex items-center justify-between">
            <div>
              <h3 class="font-semibold">{{ t.name }}</h3>
              <p class="text-sm text-slate-400">{{ t.targets.length }} ativos</p>
            </div>
            <a [routerLink]="['/investment-portfolio', t.id]" class="text-spectre-accent text-sm hover:underline">
              Ver carteira
            </a>
          </div>
        }
      </div>
    }
  `,
})
export class PortfolioTemplatesListComponent implements OnInit {
  public readonly templates = signal<Array<{ id: string; name: string; targets: unknown[] }>>([]);
  public readonly loading = signal(true);

  private readonly ipc = inject(IpcService);

  public async ngOnInit(): Promise<void> {
    const res = await this.ipc.portfolioTemplates.list();

    if (res.success) {
      this.templates.set(res.data);
    }
    this.loading.set(false);
  }
}
