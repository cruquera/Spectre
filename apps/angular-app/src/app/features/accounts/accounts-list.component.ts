import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IpcService } from '../../core/services/ipc.service';

@Component({
  imports: [FormsModule],
  standalone: true,
  templateUrl: './accounts-list.component.html',
})
export class AccountsListComponent implements OnInit {
  public readonly accounts = signal<Array<{ id: string; institutionName: string; nickname: string; currency: string }>>([]);
  public readonly loading = signal(true);
  public readonly creating = signal(false);
  public readonly institutions = [
    'Banco Inter',
    'Banco Safra',
    'Nubank',
    'Nomad',
    'Banco Inter Global',
  ] as const;

  public institutionName = '';
  public nickname = '';
  public currency = 'BRL';

  private readonly ipc = inject(IpcService);

  public async ngOnInit(): Promise<void> {
    await this.load();
  }

  public async addAccount(): Promise<void> {
    if (!this.institutionName || !this.nickname || !this.currency) return;
    this.creating.set(true);
    try {
      const res = await this.ipc.accounts.create({
        institutionName: this.institutionName,
        nickname: this.nickname,
        currency: this.currency,
      });

      if (res.success) {
        this.accounts.update((list) => [...list, res.data]);
        this.institutionName = '';
        this.nickname = '';
        this.currency = 'BRL';
      }
    } finally {
      this.creating.set(false);
    }
  }

  public async removeAccount(id: string): Promise<void> {
    const res = await this.ipc.accounts.delete(id);

    if (res.success) {
      this.accounts.update((list) => list.filter((a) => a.id !== id));
    }
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    const res = await this.ipc.accounts.list();

    if (res.success) {
      this.accounts.set(res.data);
    }
    this.loading.set(false);
  }
}
