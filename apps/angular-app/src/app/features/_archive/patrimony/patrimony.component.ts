import { Component, OnInit, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { IpcService } from '../../core/services/ipc.service';

@Component({
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './patrimony.component.html',
})
export class PatrimonyComponent implements OnInit {
  public readonly snapshots = signal<Array<{ id: string; totalValue: number; currency: string; capturedAt: string }>>([]);
  public form!: ReturnType<FormBuilder['group']>;

  private readonly ipc = inject(IpcService);
  private readonly fb = inject(FormBuilder);

  public ngOnInit(): void {
    this.form = this.fb.group({ portfolioId: ['', (c: AbstractControl) => Validators.required(c)] });
  }

  public async capture(): Promise<void> {
    const v = this.form.value as { portfolioId: string };

    await this.ipc.patrimony.capture({ portfolioId: v.portfolioId });
    await this.load();
  }

  public async load(): Promise<void> {
    const v = this.form.value as { portfolioId: string };
    const id = v.portfolioId;

    if (!id) return;
    const res = await this.ipc.patrimony.list(id);

    if (res.success) this.snapshots.set(res.data as never);
  }
}
