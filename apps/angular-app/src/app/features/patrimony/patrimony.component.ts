import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { IpcService } from '../../core/services/ipc.service';

@Component({
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './patrimony.component.html'
})
export class PatrimonyComponent implements OnInit {
  private readonly ipc = inject(IpcService);
  private readonly fb = inject(FormBuilder);
  readonly snapshots = signal<Array<{ id: string; totalValue: number; currency: string; capturedAt: string }>>([]);

  form = this.fb.group({ portfolioId: ['', Validators.required] });

  async ngOnInit() {}

  async capture() {
    await this.ipc.patrimony.capture({ portfolioId: this.form.value.portfolioId });
    await this.load();
  }

  async load() {
    const id = this.form.value.portfolioId;

    if (!id) return;
    const res = await this.ipc.patrimony.list(id);

    if (res.success) this.snapshots.set(res.data as never);
  }
}
