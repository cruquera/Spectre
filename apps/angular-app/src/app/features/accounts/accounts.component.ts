import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IpcService } from '../../core/services/ipc.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <h2 class="text-2xl font-bold mb-4">Contas</h2>
    <form class="grid grid-cols-2 gap-2 mb-6 max-w-lg" [formGroup]="form" (ngSubmit)="create()">
      <input formControlName="institutionId" placeholder="ID instituição" class="px-3 py-2 rounded bg-slate-800 border border-slate-600 col-span-2" />
      <input formControlName="name" placeholder="Nome da conta" class="px-3 py-2 rounded bg-slate-800 border border-slate-600" />
      <input formControlName="currency" placeholder="BRL" class="px-3 py-2 rounded bg-slate-800 border border-slate-600" />
      <button type="submit" class="col-span-2 px-4 py-2 rounded bg-spectre-accent text-sm">Criar conta</button>
    </form>
    <ul class="space-y-2 text-sm">
      @for (a of items(); track a.id) {
        <li class="p-3 bg-spectre-surface rounded border border-slate-700">{{ a.name }} — {{ a.currency }}</li>
      }
    </ul>
  `,
})
export class AccountsComponent implements OnInit {
  private readonly ipc = inject(IpcService);
  private readonly fb = inject(FormBuilder);
  readonly items = signal<Array<{ id: string; name: string; currency: string }>>([]);

  form = this.fb.group({
    institutionId: ['', Validators.required],
    name: ['', Validators.required],
    currency: ['BRL', Validators.required],
  });

  async ngOnInit() {
    const res = await this.ipc.accounts.list();
    if (res.success) this.items.set(res.data as never);
  }

  async create() {
    const res = await this.ipc.accounts.create(this.form.getRawValue());
    if (res.success) {
      const list = await this.ipc.accounts.list();
      if (list.success) this.items.set(list.data as never);
    }
  }
}
