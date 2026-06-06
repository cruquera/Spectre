import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  standalone: true,
  template: `
    <div class="mb-6">
      <a routerLink="/projects" class="text-sm text-spectre-accent hover:underline">&larr; Voltar para Projetos</a>
    </div>

    <div class="bg-spectre-surface rounded border border-slate-700 p-8 text-center">
      <h2 class="text-xl font-semibold mb-2">Carteira Real</h2>
      <p class="text-slate-400 mb-4">
        Preencha aqui os valores reais alocados em cada ativo do projeto.
      </p>
      <p class="text-sm text-slate-500">
        Esta funcionalidade estará disponível em breve.
      </p>
    </div>
  `,
})
export class RealPortfolioComponent {}
