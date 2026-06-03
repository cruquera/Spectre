import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { IpcService } from '../services/ipc.service';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'sp-shell',
  standalone: true,
  templateUrl: './shell.component.html'
})
export class ShellComponent {
  private readonly ipc = inject(IpcService);
  readonly session = this.ipc.session;

  nav = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/institutions', label: 'Institui????es' },
    { path: '/accounts', label: 'Contas' },
    { path: '/assets', label: 'Ativos' },
    { path: '/portfolio', label: 'Carteira' },
    { path: '/allocation', label: 'Aloca????o' },
    { path: '/contributions', label: 'Aportes' },
    { path: '/rebalancing', label: 'Rebalanceamento' },
    { path: '/brokerage-notes', label: 'Notas' },
    { path: '/patrimony', label: 'Patrim??nio' },
    { path: '/analytics', label: 'Analytics' },
    { path: '/settings', label: 'Configura????es' },
  ];

  async logout() {
    await this.ipc.identity.logout();
    this.ipc.session.set(null);
    location.href = '/auth';
  }
}
