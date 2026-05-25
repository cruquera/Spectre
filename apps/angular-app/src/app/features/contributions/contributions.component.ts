import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IpcService } from '../../core/services/ipc.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe],
  template: `
    <h2 class="text-2xl font-bold mb-4">Aportes</h2>
    <form class="grid grid-cols-2 gap-2 max-w-lg mb-6 border-b border-slate-700 pb-6" [formGroup]="blockForm" (ngSubmit)="createBlock()">
      <input formControlName="name" placeholder="Nome do bloco" class="col-span-2 px-3 py-2 rounded bg-slate-800 border border-slate-600" />
      <input formControlName="assetIds" placeholder="assetIds separados por vírgula" class="col-span-2 px-3 py-2 rounded bg-slate-800 border border-slate-600" />
      <button type="submit" class="col-span-2 px-4 py-2 rounded bg-slate-700 text-sm">Criar bloco</button>
    </form>
    <form class="grid grid-cols-2 gap-2 max-w-lg" [formGroup]="form" (ngSubmit)="simulate()">
      <input formControlName="portfolioId" placeholder="portfolioId" class="col-span-2 px-3 py-2 rounded bg-slate-800 border border-slate-600" />
      <input type="number" formControlName="amount" placeholder="Valor" class="px-3 py-2 rounded bg-slate-800 border border-slate-600" />
      <input formControlName="currency" class="px-3 py-2 rounded bg-slate-800 border border-slate-600" />
      <input type="number" formControlName="year" class="px-3 py-2 rounded bg-slate-800 border border-slate-600" />
      <input type="number" formControlName="month" class="px-3 py-2 rounded bg-slate-800 border border-slate-600" />
      <button type="submit" class="col-span-2 px-4 py-2 rounded bg-spectre-accent text-sm">Simular aporte</button>
    </form>
    @if (suggestions()) {
      <ul class="mt-4 space-y-2 text-sm">
        @for (s of suggestions(); track s.assetId) {
          <li class="p-3 bg-spectre-surface rounded border border-slate-700">
            {{ s.symbol }}: R$ {{ s.suggestedAmount }} — {{ s.rationale }}
          </li>
        }
      </ul>
    }
  `,
})
export class ContributionsComponent {
  private readonly ipc = inject(IpcService);
  private readonly fb = inject(FormBuilder);
  readonly suggestions = signal<Array<{ assetId: string; symbol: string; suggestedAmount: number; rationale: string }> | null>(null);
  readonly blockMsg = signal('');

  blockForm = this.fb.group({
    name: ['Bloco A', Validators.required],
    assetIds: ['', Validators.required],
  });

  form = this.fb.group({
    portfolioId: ['', Validators.required],
    amount: [1000, Validators.required],
    currency: ['BRL'],
    year: [new Date().getFullYear()],
    month: [new Date().getMonth() + 1],
  });

  async createBlock() {
    const v = this.blockForm.getRawValue();
    const assetIds = (v.assetIds ?? '').split(',').map((s) => s.trim()).filter(Boolean);
    const res = await this.ipc.contribution.createBlock({ name: v.name, assetIds });
    this.blockMsg.set(res.success ? 'Bloco criado' : (res.error?.message ?? 'Erro'));
  }

  async simulate() {
    const res = await this.ipc.contribution.simulate(this.form.getRawValue());
    if (res.success) this.suggestions.set(res.data as never);
  }
}
