import { JsonPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { IpcService } from '../../core/services/ipc.service';

@Component({
  imports: [ReactiveFormsModule, JsonPipe],
  standalone: true,
  templateUrl: './allocation.component.html',
})
export class AllocationComponent implements OnInit {
  public readonly analysis = signal<unknown>(null);
  public targetForm!: ReturnType<FormBuilder['group']>;
  public analyzeForm!: ReturnType<FormBuilder['group']>;

  private readonly ipc = inject(IpcService);
  private readonly fb = inject(FormBuilder);

  public ngOnInit(): void {
    this.targetForm = this.fb.group({
      category: ['CRYPTO', (c: AbstractControl) => Validators.required(c)],
      portfolioId: ['', (c: AbstractControl) => Validators.required(c)],
      targetPercent: [20, (c: AbstractControl) => Validators.required(c)],
    });

    this.analyzeForm = this.fb.group({
      portfolioId: ['', (c: AbstractControl) => Validators.required(c)],
      threshold: [5],
    });
  }

  public async setTarget(): Promise<void> {
    await this.ipc.allocation.setCategory(this.targetForm.getRawValue());
  }

  public async analyze(): Promise<void> {
    const v = this.analyzeForm.getRawValue() as { portfolioId: string; threshold: number };
    const res = await this.ipc.allocation.analyze(v.portfolioId, v.threshold ?? 5);

    if (res.success) this.analysis.set(res.data);
  }
}
