import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IpcService } from '../../core/services/ipc.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <h2 class="text-2xl font-bold mb-4">Histórico patrimonial</h2>
    <form class="flex gap-2 mb-4" [formGroup]="form" (ngSubmit)="capture()">
      <input formControlName="portfolioId" class="flex-1 px-3 py-2 rounded bg-slate-800 border border-slate-600" />
      <button type="submit" class="px-4 py-2 rounded bg-spectre-accent text-sm">Capturar snapshot</button>
      <button type="button" class="px-4 py-2 rounded bg-slate-700 text-sm" (click)="load()">Listar</button>
    </form>
    <ul class="text-sm space-y-2">
      @for (s of snapshots(); track s.id) {
        <li class="p-3 bg-spectre-surface rounded border border-slate-700">
          {{ s.capturedAt }} — {{ s.totalValue }} {{ s.currency }}
        </li>
      }
    </ul>
  `,
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
