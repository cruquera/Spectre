import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { IpcService } from '../../core/services/ipc.service';

@Component({
  imports: [FormsModule, RouterLink],
  standalone: true,
  templateUrl: './accounts-list.component.html',
})
export class AccountsListComponent implements OnInit {
  public readonly accounts = signal<Array<{ id: string; institutionName: string; nickname: string; currency: string }>>([]);
  public readonly loading = signal(true);

  private readonly ipc = inject(IpcService);

  public async ngOnInit(): Promise<void> {
    await this.load();
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
