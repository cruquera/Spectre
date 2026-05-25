import { Component, inject, OnInit, signal } from '@angular/core';
import { IpcService } from '../../core/services/ipc.service';

@Component({
  standalone: true,
  template: `
    <h2 class="text-2xl font-bold mb-4">Dashboard</h2>
    <p class="text-slate-400 mb-4">Bem-vindo, {{ session()?.displayName }}.</p>
    @if (health()) {
      <div class="bg-spectre-surface p-4 rounded border border-slate-700 text-sm">
        <p>Status: {{ health()?.status }}</p>
        <p>Versão: {{ health()?.version }}</p>
      </div>
    }
  `,
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
