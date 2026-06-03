import { Component, OnInit, inject, signal } from '@angular/core';

import { IpcService } from '../../core/services/ipc.service';

@Component({
  standalone: true,
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private readonly ipc = inject(IpcService);
  readonly session = this.ipc.session;
  readonly health = signal<{ status: string; version: string } | null>(null);

  async ngOnInit() {
    const res = await this.ipc.healthcheck();

    if (res.success && res.data) {
      this.health.set(res.data);
    }
  }
}
