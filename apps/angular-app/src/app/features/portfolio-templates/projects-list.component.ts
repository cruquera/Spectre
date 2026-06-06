import { Component } from '@angular/core';

@Component({
  imports: [],
  standalone: true,
  template: `
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold">Projetos</h2>
    </div>

    <div class="bg-spectre-surface rounded border border-slate-700 p-8 text-center">
      <p class="text-slate-400 mb-4">Nenhum projeto cadastrado.</p>
      <p class="text-sm text-slate-500">
        Complete o tour de cadastro para criar seu primeiro projeto de carteira.
      </p>
    </div>
  `,
})
export class ProjectsListComponent {}
