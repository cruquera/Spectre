import { JsonPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IpcService } from '../../core/services/ipc.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe],
  template: `
    <h2 class="text-2xl font-bold mb-4">Instituições</h2>
    <form class="flex gap-2 mb-6" [formGroup]="form" (ngSubmit)="create()">
      <input formControlName="name" placeholder="Nome" class="px-3 py-2 rounded bg-slate-800 border border-slate-600" />
      <select formControlName="type" class="px-3 py-2 rounded bg-slate-800 border border-slate-600">
        <option value="BANK">Banco</option>
        <option value="BROKER">Corretora</option>
      </select>
      <button type="submit" class="px-4 py-2 rounded bg-spectre-accent text-sm">Criar</button>
    </form>
    <ul class="space-y-2">
      @for (i of items(); track i.id) {
        <li class="p-3 bg-spectre-surface rounded border border-slate-700 text-sm">
          {{ i.name }} ({{ i.type }})
        </li>
      }
    </ul>
  `,
})
export class InstitutionsComponent implements OnInit {
  private readonly ipc = inject(IpcService);
  private readonly fb = inject(FormBuilder);
  readonly items = signal<Array<{ id: string; name: string; type: string }>>([]);

  form = this.fb.group({
    name: ['', Validators.required],
    type: ['BANK' as const, Validators.required],
  });

  async ngOnInit() {
    await this.load();
  }

  async load() {
    const res = await this.ipc.institutions.list();
    if (res.success) this.items.set(res.data as Array<{ id: string; name: string; type: string }>);
  }

  async create() {
    const res = await this.ipc.institutions.create(this.form.getRawValue());
    if (res.success) {
      this.form.reset({ type: 'BANK' });
      await this.load();
    }
  }
}
