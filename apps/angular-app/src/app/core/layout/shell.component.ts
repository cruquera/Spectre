import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { IpcService } from '../services/ipc.service';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'sp-shell',
  standalone: true,
  templateUrl: './shell.component.html',
})
export class ShellComponent {
  public get session(): { displayName: string; slug: string } | null { return this.ipc.session(); }
  public readonly nav = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Institui????es', path: '/institutions' },
    { label: 'Contas', path: '/accounts' },
    { label: 'Ativos', path: '/assets' },
    { label: 'Carteira', path: '/portfolio' },
    { label: 'Aloca????o', path: '/allocation' },
    { label: 'Aportes', path: '/contributions' },
    { label: 'Rebalanceamento', path: '/rebalancing' },
    { label: 'Notas', path: '/brokerage-notes' },
    { label: 'Patrim??nio', path: '/patrimony' },
    { label: 'Analytics', path: '/analytics' },
    { label: 'Configura????es', path: '/settings' },
  ];

  private readonly ipc = inject(IpcService);

  public async logout(): Promise<void> {
    await this.ipc.identity.logout();
    this.ipc.session.set(null);
    location.href = '/auth';
  }
}
