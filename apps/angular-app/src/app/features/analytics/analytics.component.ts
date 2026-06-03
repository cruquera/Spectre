import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { IpcService } from '../../core/services/ipc.service';

@Component({
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './analytics.component.html'
})
export class AnalyticsComponent {
  private readonly ipc = inject(IpcService);
  private readonly fb = inject(FormBuilder);
  readonly series = signal<{ dataPoints: Array<{ date: string; value: number }> } | null>(null);

  form = this.fb.group({
  benchmarkType: ['INDEX'],
  period: ['1Y'],
  source: ['YAHOO'],
  ticker: ['IBOV', Validators.required]
});

  chartBars() {
    const pts = this.series()?.dataPoints ?? [];

    if (!pts.length) return [];
    const max = Math.max(...pts.map((p) => p.value));
    const min = Math.min(...pts.map((p) => p.value));
    const range = max - min || 1;

    return pts.slice(-60).map((p) => ({
  date: p.date,
  height: ((p.value - min) / range) * 100,
  value: p.value
}));
  }

  async sync() {
    await this.ipc.benchmark.sync(this.form.getRawValue());
    await this.loadCache();
  }

  async loadCache() {
    const res = await this.ipc.benchmark.listCached(this.form.getRawValue());

    if (res.success && res.data) this.series.set(res.data as never);
  }
}
