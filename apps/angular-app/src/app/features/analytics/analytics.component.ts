import { Component, OnInit, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { IpcService } from '../../core/services/ipc.service';

@Component({
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './analytics.component.html',
})
export class AnalyticsComponent implements OnInit {
  public readonly series = signal<{ dataPoints: Array<{ date: string; value: number }> } | null>(null);
  public form!: ReturnType<FormBuilder['group']>;

  private readonly ipc = inject(IpcService);
  private readonly fb = inject(FormBuilder);

  public ngOnInit(): void {
    this.form = this.fb.group({
      benchmarkType: ['INDEX'],
      period: ['1Y'],
      source: ['YAHOO'],
      ticker: ['IBOV', (c: AbstractControl) => Validators.required(c)],
    });
  }

  public chartBars(): Array<{ date: string; height: number; value: number }> {
    const pts = this.series()?.dataPoints ?? [];

    if (!pts.length) return [];
    const max = Math.max(...pts.map((p) => p.value));
    const min = Math.min(...pts.map((p) => p.value));
    const range = max - min || 1;

    return pts.slice(-60).map((p) => ({
      date: p.date,
      height: ((p.value - min) / range) * 100,
      value: p.value,
    }));
  }

  public async sync(): Promise<void> {
    await this.ipc.benchmark.sync(this.form.getRawValue());
    await this.loadCache();
  }

  public async loadCache(): Promise<void> {
    const res = await this.ipc.benchmark.listCached(this.form.getRawValue());

    if (res.success && res.data) this.series.set(res.data as never);
  }
}
