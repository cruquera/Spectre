import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IpcService } from '../services/ipc.service';

@Component({
  selector: 'sp-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex h-screen">
      <aside class="w-56 bg-spectre-surface border-r border-slate-700 p-4 flex flex-col">
        <h1 class="text-xl font-bold text-spectre-accent mb-6">Spectre</h1>
        <nav class="flex flex-col gap-1 text-sm flex-1">
          @for (item of nav; track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="bg-slate-700 text-white"
              class="px-3 py-2 rounded hover:bg-slate-800 text-slate-300"
              >{{ item.label }}</a
            >
          }
        </nav>
        <div class="text-xs text-slate-500 mt-4">
          {{ session()?.displayName }}
        </div>
        <button
          class="mt-2 text-sm text-red-400 hover:underline"
          (click)="logout()"
        >
          Sair
        </button>
      </aside>
      <main class="flex-1 overflow-auto p-6">
        <router-outlet />
      </main>
    </div>
  `,
})
export class ShellComponent {
  private readonly ipc = inject(IpcService);
  readonly session = this.ipc.session;

  nav = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/institutions', label: 'Instituições' },
    { path: '/accounts', label: 'Contas' },
    { path: '/assets', label: 'Ativos' },
    { path: '/portfolio', label: 'Carteira' },
    { path: '/allocation', label: 'Alocação' },
    { path: '/contributions', label: 'Aportes' },
    { path: '/rebalancing', label: 'Rebalanceamento' },
    { path: '/brokerage-notes', label: 'Notas' },
    { path: '/patrimony', label: 'Patrimônio' },
    { path: '/analytics', label: 'Analytics' },
    { path: '/settings', label: 'Configurações' },
  ];

  async logout() {
    await this.ipc.identity.logout();
    this.ipc.session.set(null);
    location.href = '/auth';
  }
}
