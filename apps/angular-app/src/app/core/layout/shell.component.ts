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
  public readonly tourCompleted = signal(false);

  public readonly nav = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Contas', path: '/accounts' },
    { label: 'Projetos', path: '/projects' },
  ];

  private readonly ipc = inject(IpcService);
  private readonly router = inject(Router);

  public async ngOnInit(): Promise<void> {
    const res = await this.ipc.tour.getState();

    if (res.success) {
      this.tourCompleted.set(res.data.completed);

      if (!res.data.completed) {
        await this.router.navigate(['/tour']);
      }
    }
  }

  public async logout(): Promise<void> {
    await this.ipc.identity.logout();
    this.ipc.session.set(null);
    window.location.href = '/auth';
  }
}
