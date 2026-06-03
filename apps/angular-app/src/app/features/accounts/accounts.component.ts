import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { IpcService } from '../../core/services/ipc.service';

@Component({
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './accounts.component.html'
})
export class AccountsComponent implements OnInit {
  private readonly ipc = inject(IpcService);
  private readonly fb = inject(FormBuilder);
  readonly items = signal<Array<{ id: string; name: string; currency: string }>>([]);

  form = this.fb.group({
  currency: ['BRL', Validators.required],
  institutionId: ['', Validators.required],
  name: ['', Validators.required]
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
