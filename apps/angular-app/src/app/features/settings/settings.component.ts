import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IpcService } from '../../core/services/ipc.service';

@Component({
  imports: [FormsModule],
  standalone: true,
  templateUrl: './settings.component.html'
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
