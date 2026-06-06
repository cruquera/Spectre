import { Component, OnInit, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { IpcService } from '../../core/services/ipc.service';

@Component({
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './brokerage-notes.component.html',
})
export class BrokerageNotesComponent implements OnInit {
  public readonly notes = signal<Array<{ id: string; noteDate: string; relativePath: string; parsedStatus: string }>>([]);
  public form!: ReturnType<FormBuilder['group']>;

  private readonly ipc = inject(IpcService);
  private readonly fb = inject(FormBuilder);
  private fileBase64 = '';

  public ngOnInit(): void {
    this.form = this.fb.group({
      brokerId: ['', (c: AbstractControl) => Validators.required(c)],
      fileName: ['nota.pdf'],
      noteDate: [new Date().toISOString().slice(0, 10), (c: AbstractControl) => Validators.required(c)],
    });
    void this.load();
  }

  public async load(): Promise<void> {
    const res = await this.ipc.brokerageNotes.list();

    if (res.success) this.notes.set(res.data as never);
  }

  public onFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;
    this.form.patchValue({ fileName: file.name });
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;

      this.fileBase64 = result.split(',')[1] ?? '';
    };
    reader.readAsDataURL(file);
  }

  public async upload(): Promise<void> {
    const res = await this.ipc.brokerageNotes.register({
      ...this.form.getRawValue(),
      base64Content: this.fileBase64,
    });

    if (res.success) await this.load();
  }
}
