import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { IpcService } from '../../core/services/ipc.service';

@Component({
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './contributions.component.html'
})
export class ContributionsComponent {
  private readonly ipc = inject(IpcService);
  private readonly fb = inject(FormBuilder);
  readonly suggestions = signal<Array<{ assetId: string; symbol: string; suggestedAmount: number; rationale: string }> | null>(null);
  readonly blockMsg = signal('');

  blockForm = this.fb.group({
  assetIds: ['', Validators.required],
  name: ['Bloco A', Validators.required]
});

  form = this.fb.group({
  amount: [1000, Validators.required],
  currency: ['BRL'],
  month: [new Date().getMonth() + 1],
  portfolioId: ['', Validators.required],
  year: [new Date().getFullYear()]
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
