import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { IpcService } from '../services/ipc.service';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'sp-shell',
  standalone: true,
  templateUrl: './shell.component.html',
})
export class ShellComponent implements OnInit {
  public get session(): { displayName: string; username: string } | null { return this.ipc.session(); }
  public readonly onboardingCompleted = signal(false);

  public readonly nav = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Contas', path: '/accounts' },
    { label: 'Projetos', path: '/portfolio-templates' },
    { label: 'Carteiras', path: '/investment-portfolio' },
  ];

  private readonly ipc = inject(IpcService);
  private readonly router = inject(Router);

  public async ngOnInit(): Promise<void> {
    const res = await this.ipc.onboarding.getState();

    if (res.success) {
      this.onboardingCompleted.set(res.data.status === 'COMPLETED');

      if (res.data.status !== 'COMPLETED') {
        await this.router.navigate(['/onboarding']);
      }
    }
  }

  public async logout(): Promise<void> {
    await this.ipc.identity.logout();
    this.ipc.session.set(null);
    window.location.href = '/auth';
  }
}
