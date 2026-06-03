import { Component, OnInit, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { IpcService } from '../../core/services/ipc.service';

@Component({
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './contributions.component.html',
})
export class ContributionsComponent implements OnInit {
  public readonly suggestions = signal<Array<{ assetId: string; symbol: string; suggestedAmount: number; rationale: string }> | null>(null);
  public readonly blockMsg = signal('');
  public blockForm!: ReturnType<FormBuilder['group']>;
  public form!: ReturnType<FormBuilder['group']>;

  private readonly ipc = inject(IpcService);
  private readonly fb = inject(FormBuilder);

  public ngOnInit(): void {
    this.blockForm = this.fb.group({
      assetIds: ['', (c: AbstractControl) => Validators.required(c)],
      name: ['Bloco A', (c: AbstractControl) => Validators.required(c)],
    });
    this.form = this.fb.group({
      amount: [1000, (c: AbstractControl) => Validators.required(c)],
      currency: ['BRL'],
      month: [new Date().getMonth() + 1],
      portfolioId: ['', (c: AbstractControl) => Validators.required(c)],
      year: [new Date().getFullYear()],
    });
  }

  public async createBlock(): Promise<void> {
    const v = this.blockForm.getRawValue() as { assetIds: string; name: string };
    const assetIds = v.assetIds.split(',').map((s: string) => s.trim()).filter(Boolean);
    const res = await this.ipc.contribution.createBlock({ assetIds, name: v.name });

    this.blockMsg.set(res.success ? 'Bloco criado' : (res.error?.message ?? 'Erro'));
  }

  public async simulate(): Promise<void> {
    const res = await this.ipc.contribution.simulate(this.form.getRawValue());

    if (res.success) this.suggestions.set(res.data as never);
  }
}
