import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { IpcService } from '../../core/services/ipc.service';

@Component({
  imports: [ReactiveFormsModule, JsonPipe],
  standalone: true,
  templateUrl: './allocation.component.html'
})
export class AllocationComponent {
  private readonly ipc = inject(IpcService);
  private readonly fb = inject(FormBuilder);
  readonly analysis = signal<unknown>(null);

  targetForm = this.fb.group({
  category: ['CRYPTO', Validators.required],
  portfolioId: ['', Validators.required],
  targetPercent: [20, Validators.required]
});

  analyzeForm = this.fb.group({
  portfolioId: ['', Validators.required],
  threshold: [5]
});

  async setTarget() {
    await this.ipc.allocation.setCategory(this.targetForm.getRawValue());
  }

  async analyze() {
    const v = this.analyzeForm.getRawValue();
    const res = await this.ipc.allocation.analyze(v.portfolioId!, v.threshold ?? 5);

    if (res.success) this.analysis.set(res.data);
  }
}
