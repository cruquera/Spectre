import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { IpcService } from '../../core/services/ipc.service';

@Component({
  imports: [RouterLink],
  standalone: true,
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  public get session(): { displayName: string; username: string } | null { return this.ipc.session(); }
  public readonly tourCompleted = signal(false);
  public readonly accountCount = signal(0);

  private readonly ipc = inject(IpcService);

  public async ngOnInit(): Promise<void> {
    const tourRes = await this.ipc.tour.getState();

    if (tourRes.success) {
      this.tourCompleted.set(tourRes.data.completed);

      if (tourRes.data.completed) {
        const accountsRes = await this.ipc.accounts.list();

        if (accountsRes.success) {
          this.accountCount.set(accountsRes.data.length);
        }
      }
    }
  }
}
