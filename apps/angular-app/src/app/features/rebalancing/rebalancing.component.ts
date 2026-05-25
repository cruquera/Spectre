import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IpcService } from '../../core/services/ipc.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe],
  template: `
    <h2 class="text-2xl font-bold mb-4">Rebalanceamento</h2>
    <form class="flex gap-2 mb-4" [formGroup]="form" (ngSubmit)="analyze()">
      <input formControlName="portfolioId" class="flex-1 px-3 py-2 rounded bg-slate-800 border border-slate-600" />
      <input type="number" formControlName="threshold" class="w-24 px-3 py-2 rounded bg-slate-800 border border-slate-600" />
      <button type="submit" class="px-4 py-2 rounded bg-spectre-accent text-sm">Analisar</button>
    </form>
    @if (result()) {
      <div class="bg-spectre-surface p-4 rounded text-sm"><pre>{{ result() | json }}</pre></div>
    }
  `,
})
export class RebalancingComponent {
  private readonly ipc = inject(IpcService);
  private readonly fb = inject(FormBuilder);
  readonly result = signal<unknown>(null);

  form = this.fb.group({
    portfolioId: ['', Validators.required],
    threshold: [5],
  });

  async analyze() {
    const v = this.form.getRawValue();
    const res = await this.ipc.rebalancing.analyze(v.portfolioId!, v.threshold ?? 5);
    if (res.success) this.result.set(res.data);
  }
}
