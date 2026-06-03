import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { IpcService } from '../../core/services/ipc.service';

@Component({
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './portfolio.component.html'
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
  currency: ['BRL', Validators.required],
  fees: [0],
  quantity: [1, Validators.required],
  taxes: [0],
  tradeDate: [new Date().toISOString().slice(0, 10), Validators.required],
  type: ['BUY', Validators.required],
  unitPrice: [0, Validators.required]
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
