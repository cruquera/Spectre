import { Component, OnInit, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { IpcService } from '../../core/services/ipc.service';

@Component({
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './portfolio.component.html',
})
export class PortfolioComponent implements OnInit {
  public readonly portfolios = signal<Array<{ id: string; name: string; baseCurrency: string }>>([]);
  public readonly positions = signal<Array<{ id: string; quantity: number; averageCost: number; asset?: { symbol: string } }>>([]);
  public portfolioForm!: ReturnType<FormBuilder['group']>;
  public txForm!: ReturnType<FormBuilder['group']>;

  private readonly ipc = inject(IpcService);
  private readonly fb = inject(FormBuilder);

  public ngOnInit(): void {
    this.portfolioForm = this.fb.group({ name: ['', (c: AbstractControl) => Validators.required(c)] });
    this.txForm = this.fb.group({
      accountId: ['', (c: AbstractControl) => Validators.required(c)],
      assetId: ['', (c: AbstractControl) => Validators.required(c)],
      currency: ['BRL', (c: AbstractControl) => Validators.required(c)],
      fees: [0],
      quantity: [1, (c: AbstractControl) => Validators.required(c)],
      taxes: [0],
      tradeDate: [new Date().toISOString().slice(0, 10), (c: AbstractControl) => Validators.required(c)],
      type: ['BUY', (c: AbstractControl) => Validators.required(c)],
      unitPrice: [0, (c: AbstractControl) => Validators.required(c)],
    });
    void this.load();
  }

  public async load(): Promise<void> {
    const p = await this.ipc.portfolio.list();

    if (p.success) this.portfolios.set(p.data as never);
    const pos = await this.ipc.portfolio.listPositions();

    if (pos.success) this.positions.set(pos.data as never);
  }

  public async createPortfolio(): Promise<void> {
    const v = this.portfolioForm.value as { name: string };

    await this.ipc.portfolio.create({ baseCurrency: 'BRL', name: v.name });
    await this.load();
  }

  public async createTx(): Promise<void> {
    await this.ipc.portfolio.createTransaction(this.txForm.getRawValue());
    await this.load();
  }
}
