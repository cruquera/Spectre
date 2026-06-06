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
  public readonly onboardingCompleted = signal(false);
  public readonly accountCount = signal(0);

  private readonly ipc = inject(IpcService);

  public async ngOnInit(): Promise<void> {
    const onboardingRes = await this.ipc.onboarding.getState();

    if (onboardingRes.success) {
      this.onboardingCompleted.set(onboardingRes.data.status === 'COMPLETED');

      if (onboardingRes.data.status === 'COMPLETED') {
        const accountsRes = await this.ipc.accounts.list();

        if (accountsRes.success) {
          this.accountCount.set(accountsRes.data.length);
        }
      }
    }
  }
}
