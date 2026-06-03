import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { IpcService } from '../../core/services/ipc.service';

@Component({
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './assets.component.html'
})
export class AssetsComponent implements OnInit {
  private readonly ipc = inject(IpcService);
  private readonly fb = inject(FormBuilder);
  readonly items = signal<Array<{ id: string; symbol: string; name: string; category: string }>>([]);

  form = this.fb.group({
  assetType: ['CRYPTO', Validators.required],
  category: ['CRYPTO' as const, Validators.required],
  currency: ['USD', Validators.required],
  name: ['', Validators.required],
  symbol: ['', Validators.required]
});

  async ngOnInit() {
    const res = await this.ipc.assets.list();

    if (res.success) this.items.set(res.data as never);
  }

  async create() {
    const res = await this.ipc.assets.create(this.form.getRawValue());

    if (res.success) {
      const list = await this.ipc.assets.list();

      if (list.success) this.items.set(list.data as never);
    }
  }
}
