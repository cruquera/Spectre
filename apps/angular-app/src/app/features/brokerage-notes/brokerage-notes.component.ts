import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { IpcService } from '../../core/services/ipc.service';

@Component({
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './brokerage-notes.component.html'
})
export class BrokerageNotesComponent implements OnInit {
  private readonly ipc = inject(IpcService);
  private readonly fb = inject(FormBuilder);
  readonly notes = signal<Array<{ id: string; noteDate: string; relativePath: string; parsedStatus: string }>>([]);
  private fileBase64 = '';

  form = this.fb.group({
  brokerId: ['', Validators.required],
  fileName: ['nota.pdf'],
  noteDate: [new Date().toISOString().slice(0, 10), Validators.required]
});

  async ngOnInit() {
    await this.load();
  }

  async load() {
    const res = await this.ipc.brokerageNotes.list();

    if (res.success) this.notes.set(res.data as never);
  }

  onFile(event: Event) {
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

  async upload() {
    const res = await this.ipc.brokerageNotes.register({
      ...this.form.getRawValue(),
      base64Content: this.fileBase64,
    });

    if (res.success) await this.load();
  }
}
