import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IpcService } from '../../core/services/ipc.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <h2 class="text-2xl font-bold mb-4">Notas de corretagem</h2>
    <p class="text-slate-400 text-sm mb-4">v1: upload + metadata. Parser OCR em fase futura.</p>
    <form class="grid gap-2 max-w-lg mb-6" [formGroup]="form" (ngSubmit)="upload()">
      <input formControlName="brokerId" placeholder="brokerId" class="px-3 py-2 rounded bg-slate-800 border border-slate-600" />
      <input type="date" formControlName="noteDate" class="px-3 py-2 rounded bg-slate-800 border border-slate-600" />
      <input type="file" accept=".pdf" (change)="onFile($event)" class="text-sm" />
      <button type="submit" class="px-4 py-2 rounded bg-spectre-accent text-sm">Registrar nota</button>
    </form>
    <ul class="text-sm space-y-2">
      @for (n of notes(); track n.id) {
        <li class="p-3 bg-spectre-surface rounded border border-slate-700">
          {{ n.noteDate }} — {{ n.relativePath }} ({{ n.parsedStatus }})
        </li>
      }
    </ul>
  `,
})
export class BrokerageNotesComponent implements OnInit {
  private readonly ipc = inject(IpcService);
  private readonly fb = inject(FormBuilder);
  readonly notes = signal<Array<{ id: string; noteDate: string; relativePath: string; parsedStatus: string }>>([]);
  private fileBase64 = '';

  form = this.fb.group({
    brokerId: ['', Validators.required],
    noteDate: [new Date().toISOString().slice(0, 10), Validators.required],
    fileName: ['nota.pdf'],
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
