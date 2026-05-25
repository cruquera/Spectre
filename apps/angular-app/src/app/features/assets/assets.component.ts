import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IpcService } from '../../core/services/ipc.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <h2 class="text-2xl font-bold mb-4">Ativos</h2>
    <form class="grid grid-cols-2 gap-2 mb-6 max-w-2xl" [formGroup]="form" (ngSubmit)="create()">
      <input formControlName="symbol" placeholder="BTC" class="px-3 py-2 rounded bg-slate-800 border border-slate-600" />
      <input formControlName="name" placeholder="Bitcoin" class="px-3 py-2 rounded bg-slate-800 border border-slate-600" />
      <input formControlName="assetType" placeholder="CRYPTO" class="px-3 py-2 rounded bg-slate-800 border border-slate-600" />
      <select formControlName="category" class="px-3 py-2 rounded bg-slate-800 border border-slate-600">
        <option value="CRYPTO">Cripto</option>
        <option value="FIXED_INCOME">Renda Fixa</option>
        <option value="VARIABLE_INCOME">Renda Variável</option>
        <option value="REAL_ESTATE">Imóveis</option>
      </select>
      <input formControlName="currency" placeholder="USD" class="px-3 py-2 rounded bg-slate-800 border border-slate-600" />
      <button type="submit" class="col-span-2 px-4 py-2 rounded bg-spectre-accent text-sm">Criar ativo</button>
    </form>
    <ul class="space-y-2 text-sm">
      @for (a of items(); track a.id) {
        <li class="p-3 bg-spectre-surface rounded border border-slate-700">
          {{ a.symbol }} — {{ a.name }} ({{ a.category }})
        </li>
      }
    </ul>
  `,
})
export class AssetsComponent implements OnInit {
  private readonly ipc = inject(IpcService);
  private readonly fb = inject(FormBuilder);
  readonly items = signal<Array<{ id: string; symbol: string; name: string; category: string }>>([]);

  form = this.fb.group({
    symbol: ['', Validators.required],
    name: ['', Validators.required],
    assetType: ['CRYPTO', Validators.required],
    category: ['CRYPTO' as const, Validators.required],
    currency: ['USD', Validators.required],
  });

  async ngOnInit() {
    const res = await this.ipc.assets.list();
    if (res.success) this.items.set(res.data as never);
  }

  async create() {
    const res = await this.ipc.assets.create(this.form.getRawValue());
    if (res.success) {
      const list = await this.ipc.assets.list();
      if (list.success) this.items.set(list.data as never);
    }
  }
}
