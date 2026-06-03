import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { IpcService } from '../../core/services/ipc.service';

@Component({
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './institutions.component.html'
})
export class InstitutionsComponent implements OnInit {
  private readonly ipc = inject(IpcService);
  private readonly fb = inject(FormBuilder);
  readonly items = signal<Array<{ id: string; name: string; type: string }>>([]);

  form = this.fb.group({
  name: ['', Validators.required],
  type: ['BANK' as const, Validators.required]
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
