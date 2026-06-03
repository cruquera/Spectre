import { Component, OnInit, inject, signal } from '@angular/core';

import { IpcService } from '../../core/services/ipc.service';

@Component({
  standalone: true,
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  public get session(): { displayName: string; slug: string } | null { return this.ipc.session(); }
  public readonly health = signal<{ status: string; version: string } | null>(null);

  private readonly ipc = inject(IpcService);

  public ngOnInit(): void {
    void this.load();
  }

  private async load(): Promise<void> {
    const res = await this.ipc.healthcheck();

    if (res.success && res.data) {
      this.health.set(res.data);
    }
  }
}
