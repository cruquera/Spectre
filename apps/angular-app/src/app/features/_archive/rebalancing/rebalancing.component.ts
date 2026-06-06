import { JsonPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { IpcService } from '../../core/services/ipc.service';

@Component({
  imports: [ReactiveFormsModule, JsonPipe],
  standalone: true,
  templateUrl: './rebalancing.component.html',
})
export class RebalancingComponent implements OnInit {
  public readonly result = signal<unknown>(null);
  public form!: ReturnType<FormBuilder['group']>;

  private readonly ipc = inject(IpcService);
  private readonly fb = inject(FormBuilder);

  public ngOnInit(): void {
    this.form = this.fb.group({
      portfolioId: ['', (c: AbstractControl) => Validators.required(c)],
      threshold: [5],
    });
  }

  public async analyze(): Promise<void> {
    const v = this.form.getRawValue() as { portfolioId: string; threshold: number };
    const res = await this.ipc.rebalancing.analyze(v.portfolioId, v.threshold ?? 5);

    if (res.success) this.result.set(res.data);
  }
}
