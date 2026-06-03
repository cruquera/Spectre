import { Component, OnInit, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { IpcService } from '../../core/services/ipc.service';

@Component({
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './accounts.component.html',
})
export class AccountsComponent implements OnInit {
  public readonly items = signal<Array<{ id: string; name: string; currency: string }>>([]);
  public form!: FormGroup;

  private readonly ipc = inject(IpcService);
  private readonly fb = inject(FormBuilder);

  public ngOnInit(): void {
    this.form = this.fb.group({
      currency: ['BRL', (c: AbstractControl) => Validators.required(c)],
      institutionId: ['', (c: AbstractControl) => Validators.required(c)],
      name: ['', (c: AbstractControl) => Validators.required(c)],
    });
    void this.load();
  }

  public async create(): Promise<void> {
    const res = await this.ipc.accounts.create(this.form.getRawValue());

    if (res.success) {
      const list = await this.ipc.accounts.list();

      if (list.success) this.items.set(list.data as never);
    }
  }

  private async load(): Promise<void> {
    const res = await this.ipc.accounts.list();

    if (res.success) this.items.set(res.data as never);
  }
}
