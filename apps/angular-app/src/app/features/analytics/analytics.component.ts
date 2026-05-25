import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IpcService } from '../../core/services/ipc.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <h2 class="text-2xl font-bold mb-4">Analytics & Benchmark</h2>
    <form class="flex flex-wrap gap-2 mb-4" [formGroup]="form" (ngSubmit)="sync()">
      <input formControlName="ticker" placeholder="Ticker" class="px-3 py-2 rounded bg-slate-800 border border-slate-600" />
      <select formControlName="source" class="px-3 py-2 rounded bg-slate-800 border border-slate-600">
        <option value="YAHOO">Yahoo</option>
        <option value="BCB">BCB</option>
        <option value="IBGE">IBGE</option>
      </select>
      <button type="submit" class="px-4 py-2 rounded bg-spectre-accent text-sm">Sync benchmark</button>
      <button type="button" class="px-4 py-2 rounded bg-slate-700 text-sm" (click)="loadCache()">Ver cache</button>
    </form>
    @if (series()) {
      <p class="text-sm text-slate-400 mb-2">{{ series()?.dataPoints?.length }} pontos em cache</p>
      <div class="h-48 bg-spectre-surface rounded border border-slate-700 flex items-end gap-0.5 p-2">
        @for (p of chartBars(); track p.date) {
          <div
            class="bg-spectre-accent flex-1 min-w-[2px]"
            [style.height.%]="p.height"
            [title]="p.date + ': ' + p.value"
          ></div>
        }
      </div>
    }
  `,
})
export class AnalyticsComponent {
  private readonly ipc = inject(IpcService);
  private readonly fb = inject(FormBuilder);
  readonly series = signal<{ dataPoints: Array<{ date: string; value: number }> } | null>(null);

  form = this.fb.group({
    ticker: ['IBOV', Validators.required],
    period: ['1Y'],
    benchmarkType: ['INDEX'],
    source: ['YAHOO'],
  });

  chartBars() {
    const pts = this.series()?.dataPoints ?? [];
    if (!pts.length) return [];
    const max = Math.max(...pts.map((p) => p.value));
    const min = Math.min(...pts.map((p) => p.value));
    const range = max - min || 1;
    return pts.slice(-60).map((p) => ({
      date: p.date,
      value: p.value,
      height: ((p.value - min) / range) * 100,
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
