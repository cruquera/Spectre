import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { IpcService } from '../../core/services/ipc.service';

@Component({
  imports: [ReactiveFormsModule, JsonPipe],
  standalone: true,
  templateUrl: './rebalancing.component.html'
})
export class RebalancingComponent {
  private readonly ipc = inject(IpcService);
  private readonly fb = inject(FormBuilder);
  readonly result = signal<unknown>(null);

  form = this.fb.group({
  portfolioId: ['', Validators.required],
  threshold: [5]
});

  async analyze() {
    const v = this.form.getRawValue();
    const res = await this.ipc.rebalancing.analyze(v.portfolioId!, v.threshold ?? 5);

    if (res.success) this.result.set(res.data);
  }
}
