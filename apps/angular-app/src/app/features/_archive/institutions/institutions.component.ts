import { Component, OnInit, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { IpcService } from '../../core/services/ipc.service';

@Component({
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './institutions.component.html',
})
export class InstitutionsComponent implements OnInit {
  public readonly items = signal<Array<{ id: string; name: string; type: string }>>([]);
  public form!: ReturnType<FormBuilder['group']>;

  private readonly ipc = inject(IpcService);
  private readonly fb = inject(FormBuilder);

  public ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', (c: AbstractControl) => Validators.required(c)],
      type: ['BANK' as const, (c: AbstractControl) => Validators.required(c)],
    });
    void this.load();
  }

  public async load(): Promise<void> {
    const res = await this.ipc.institutions.list();

    if (res.success) this.items.set(res.data as Array<{ id: string; name: string; type: string }>);
  }

  public async create(): Promise<void> {
    const res = await this.ipc.institutions.create(this.form.getRawValue());

    if (res.success) {
      this.form.reset({ type: 'BANK' });
      await this.load();
    }
  }
}
