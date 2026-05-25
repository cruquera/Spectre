import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IpcService } from '../../core/services/ipc.service';

@Component({
  standalone: true,
  imports: [FormsModule],
  template: `
    <h2 class="text-2xl font-bold mb-4">Configurações & Importação</h2>
    <section class="mb-8">
      <h3 class="font-semibold mb-2">Importar cotações (CSV)</h3>
      <p class="text-xs text-slate-500 mb-2">symbol,price,currency,asOf</p>
      <textarea
        [(ngModel)]="quotesCsv"
        class="w-full h-24 px-3 py-2 rounded bg-slate-800 border border-slate-600 text-sm font-mono"
      ></textarea>
      <button class="mt-2 px-4 py-2 rounded bg-spectre-accent text-sm" (click)="importQuotes()">Importar</button>
      @if (msg()) { <p class="text-sm mt-2 text-emerald-400">{{ msg() }}</p> }
    </section>
    <section class="mb-8">
      <h3 class="font-semibold mb-2">FX via Benchmark (BCB)</h3>
      <button class="px-4 py-2 rounded bg-slate-700 text-sm" (click)="syncFx()">Sync USD/BRL (ticker USDBRL)</button>
    </section>
    <section>
      <h3 class="font-semibold mb-2">IR — Preview (fase 9 base)</h3>
      <button class="px-4 py-2 rounded bg-slate-700 text-sm" (click)="taxPreview()">Gerar preview {{ year }}</button>
    </section>
  `,
})
export class SettingsComponent {
  private readonly ipc = inject(IpcService);
  readonly msg = signal('');
  quotesCsv = 'symbol,price,currency,asOf\nBTC,50000,USD,2026-01-01';
  year = new Date().getFullYear();

  async importQuotes() {
    const res = await this.ipc.import.quotesCsv({ csvContent: this.quotesCsv });
    if (res.success) this.msg.set(`Importados: ${JSON.stringify(res.data)}`);
  }

  async syncFx() {
    const res = await this.ipc.import.syncFx('USD', 'BRL', 'USDBRL');
    if (res.success) this.msg.set(`FX: ${JSON.stringify(res.data)}`);
  }

  async taxPreview() {
    const res = await this.ipc.tax.preview({ year: this.year });
    if (res.success) this.msg.set(`Tax preview: ${JSON.stringify(res.data)}`);
  }
}
