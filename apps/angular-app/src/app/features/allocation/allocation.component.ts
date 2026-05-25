import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IpcService } from '../../core/services/ipc.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe],
  template: `
    <h2 class="text-2xl font-bold mb-4">Alocação</h2>
    <form class="grid grid-cols-2 gap-2 mb-4 max-w-lg" [formGroup]="targetForm" (ngSubmit)="setTarget()">
      <input formControlName="portfolioId" placeholder="portfolioId" class="col-span-2 px-3 py-2 rounded bg-slate-800 border border-slate-600" />
      <select formControlName="category" class="px-3 py-2 rounded bg-slate-800 border border-slate-600">
        <option value="CRYPTO">Cripto</option>
        <option value="VARIABLE_INCOME">RV</option>
        <option value="FIXED_INCOME">RF</option>
        <option value="REAL_ESTATE">Imóveis</option>
      </select>
      <input type="number" formControlName="targetPercent" placeholder="%" class="px-3 py-2 rounded bg-slate-800 border border-slate-600" />
      <button type="submit" class="col-span-2 px-4 py-2 rounded bg-spectre-accent text-sm">Definir alvo categoria</button>
    </form>
    <form class="flex gap-2 mb-6" [formGroup]="analyzeForm" (ngSubmit)="analyze()">
      <input formControlName="portfolioId" placeholder="portfolioId" class="px-3 py-2 rounded bg-slate-800 border border-slate-600 flex-1" />
      <input type="number" formControlName="threshold" class="w-20 px-3 py-2 rounded bg-slate-800 border border-slate-600" />
      <button type="submit" class="px-4 py-2 rounded bg-emerald-600 text-sm">Analisar</button>
    </form>
    @if (analysis()) {
      <div class="bg-spectre-surface p-4 rounded border border-slate-700 text-sm overflow-auto">
        <pre>{{ analysis() | json }}</pre>
      </div>
    }
  `,
})
export class AllocationComponent {
  private readonly ipc = inject(IpcService);
  private readonly fb = inject(FormBuilder);
  readonly analysis = signal<unknown>(null);

  targetForm = this.fb.group({
    portfolioId: ['', Validators.required],
    category: ['CRYPTO', Validators.required],
    targetPercent: [20, Validators.required],
  });

  analyzeForm = this.fb.group({
    portfolioId: ['', Validators.required],
    threshold: [5],
  });

  async setTarget() {
    await this.ipc.allocation.setCategory(this.targetForm.getRawValue());
  }

  async analyze() {
    const v = this.analyzeForm.getRawValue();
    const res = await this.ipc.allocation.analyze(v.portfolioId!, v.threshold ?? 5);
    if (res.success) this.analysis.set(res.data);
  }
}
