import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IpcService } from '../../core/services/ipc.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <h2 class="text-2xl font-bold mb-4">Carteira</h2>
    <form class="flex gap-2 mb-4" [formGroup]="portfolioForm" (ngSubmit)="createPortfolio()">
      <input formControlName="name" placeholder="Carteira principal" class="px-3 py-2 rounded bg-slate-800 border border-slate-600" />
      <button type="submit" class="px-4 py-2 rounded bg-spectre-accent text-sm">Criar carteira</button>
    </form>
    <form class="grid grid-cols-2 gap-2 mb-6 max-w-2xl border-t border-slate-700 pt-4" [formGroup]="txForm" (ngSubmit)="createTx()">
      <input formControlName="accountId" placeholder="accountId" class="px-3 py-2 rounded bg-slate-800 border border-slate-600 col-span-2" />
      <input formControlName="assetId" placeholder="assetId" class="px-3 py-2 rounded bg-slate-800 border border-slate-600 col-span-2" />
      <select formControlName="type" class="px-3 py-2 rounded bg-slate-800 border border-slate-600">
        <option value="BUY">Compra</option>
        <option value="SELL">Venda</option>
      </select>
      <input type="number" formControlName="quantity" placeholder="Qtd" class="px-3 py-2 rounded bg-slate-800 border border-slate-600" />
      <input type="number" formControlName="unitPrice" placeholder="Preço" class="px-3 py-2 rounded bg-slate-800 border border-slate-600" />
      <input formControlName="tradeDate" type="date" class="px-3 py-2 rounded bg-slate-800 border border-slate-600" />
      <button type="submit" class="col-span-2 px-4 py-2 rounded bg-emerald-600 text-sm">Lançar operação</button>
    </form>
    <h3 class="font-semibold mb-2">Carteiras</h3>
    <ul class="text-sm space-y-1 mb-4">
      @for (p of portfolios(); track p.id) {
        <li>{{ p.name }} ({{ p.baseCurrency }}) — {{ p.id }}</li>
      }
    </ul>
    <h3 class="font-semibold mb-2">Posições</h3>
    <ul class="text-sm space-y-1">
      @for (pos of positions(); track pos.id) {
        <li>{{ pos.asset?.symbol }}: {{ pos.quantity }} @ {{ pos.averageCost }}</li>
      }
    </ul>
  `,
})
export class PortfolioComponent implements OnInit {
  private readonly ipc = inject(IpcService);
  private readonly fb = inject(FormBuilder);
  readonly portfolios = signal<Array<{ id: string; name: string; baseCurrency: string }>>([]);
  readonly positions = signal<Array<{ id: string; quantity: number; averageCost: number; asset?: { symbol: string } }>>([]);

  portfolioForm = this.fb.group({ name: ['', Validators.required] });
  txForm = this.fb.group({
    accountId: ['', Validators.required],
    assetId: ['', Validators.required],
    type: ['BUY', Validators.required],
    quantity: [1, Validators.required],
    unitPrice: [0, Validators.required],
    fees: [0],
    taxes: [0],
    tradeDate: [new Date().toISOString().slice(0, 10), Validators.required],
    currency: ['BRL', Validators.required],
  });

  async ngOnInit() {
    await this.load();
  }

  async load() {
    const p = await this.ipc.portfolio.list();
    if (p.success) this.portfolios.set(p.data as never);
    const pos = await this.ipc.portfolio.listPositions();
    if (pos.success) this.positions.set(pos.data as never);
  }

  async createPortfolio() {
    await this.ipc.portfolio.create({ name: this.portfolioForm.value.name, baseCurrency: 'BRL' });
    await this.load();
  }

  async createTx() {
    await this.ipc.portfolio.createTransaction(this.txForm.getRawValue());
    await this.load();
  }
}
